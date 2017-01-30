'use strict';

const SOURCE   = 'id_photo',
	  RESULT   = 'id_photo',
	  FILE_URL = 'https://image.flaticon.com/teams/1-freepik.jpg';

let cp     = require('child_process'),
	should = require('should'),
	service;

describe('Service', function () {
	this.slow(5000);

	after('terminate child process', function (done) {
		this.timeout(30000);

		setTimeout(function () {
			service.kill('SIGKILL');
			done();
		}, 25000);
	});

	describe('#spawn', function () {
		it('should spawn a child process', function () {
			should.ok(service = cp.fork(process.cwd()), 'Child process not spawned.');
		});
	});

	describe('#handShake', function () {
		it('should notify the parent process when ready within 5 seconds', function (done) {
			this.timeout(5000);

			service.on('message', function (message) {
				if (message.type === 'ready')
					done();
			});

			service.send({
				type: 'ready',
				data: {
					options: {
						source: SOURCE,
						result: RESULT
					}
				}
			}, function (error) {
				should.ifError(error);
			});
		});
	});

	describe('#data', function () {
		it('should process the data and send back a result', function (done) {
			this.timeout(10000);

			var requestId = (new Date()).getTime().toString();

			service.on('message', function (message) {
				if (message.type === 'result') {
					console.log(message.data);
				}
			});

			service.send({
				type: 'data',
				requestId: requestId,
				data: {
					id_photo: FILE_URL
				}
			}, function (error) {
				should.ifError(error);
			});
		});
	});
});