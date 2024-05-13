import {assert} from 'chai';
import request from 'supertest';

import {server} from '../../../imports/_test/fixtures';

import absoluteURL from '../../../imports/app/absoluteURL';

const app = absoluteURL('api/healthcheck');

server(__filename, () => {
	it('works', async () => {
		const response = await request(app).get(`/`);

		assert.equal(response.status, 200);
		assert.equal(response.text, 'OK');
	});
});
