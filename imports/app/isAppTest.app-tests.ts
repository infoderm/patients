import {assert} from 'chai';

import {client, server} from '../_test/fixtures';

import isAppTest from './isAppTest';

client(__filename, () => {
	it('should work on the client', () => {
		assert(isAppTest());
	});
});

server(__filename, () => {
	it('should work on the server', () => {
		assert(isAppTest());
	});
});
