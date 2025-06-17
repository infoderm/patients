// @ts-check

const http = require('http');
const process = require('process');

const endpoint =
	process.argv.length >= 3
		? process.argv[2]
		: `http://localhost:${process.env.PORT}/api/healthcheck`;

const expectedStatusCode = 200;
const expected = 'OK';

const req = http.get(endpoint, (res) => {
	if (res.statusCode !== expectedStatusCode) {
		req.destroy(new Error(`Response status is not ${expectedStatusCode}.`));
	}

	res.setEncoding('utf8'); // Set encoding to handle response data as strings
	let data = '';
	res.on('readable', () => {
		let chunk;
		while ((chunk = res.read(expected.length + 1)) !== null) {
			data += chunk;
			if (data.length >= expected.length + 1) {
				const got = data.slice(0, 2) + '...';
				req.destroy(
					new Error(
						`Response body is longer than expected (expected ${expected}, got ${got}).`,
					),
				);
				break;
			}
		}
	});
	res.on('end', () => {
		if (data !== expected) {
			req.destroy(new Error(`Response body is not exactly ${expected}.`));
		}
	});
	res.on('error', (error) => {
		req.destroy(error);
	});
});
