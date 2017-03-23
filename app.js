'use strict'

const reekoh = require('reekoh')
const _plugin = new reekoh.plugins.Service()

const request = require('request').defaults({ encoding: null })

_plugin.on('data', (data) => {
  request.get(data[_plugin.config.source], (err, response, body) => {
    if (err) {
      console.error(err)
      _plugin.logException(err)
    } else if (response.statusCode === 200) {
      let contents = new Buffer(body).toString('base64')
      let result = {}

      result[_plugin.config.result] = contents

      console.log(result[_plugin.config.result])

      _plugin.pipe(data, result)
        .then(() => {
          _plugin.log(`${data[_plugin.config.source]} processed successfully.`)
        })
        .catch((error) => {
          _plugin.logException(error)
        })
    }
  })
})

_plugin.once('ready', () => {
  _plugin.log('Base64 Service has been initialized.')
  _plugin.emit('init')
})

module.exports = _plugin
