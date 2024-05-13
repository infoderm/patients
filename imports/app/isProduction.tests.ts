import {assert} from 'chai';

import {client, server} from '../_test/fixtures';

import isProduction from './isProduction';

client(__filename, () => {
	it('should work on the client', () => {
		assert(!isProduction());
	});
});

server(__filename, () => {
	it('should work on the server', () => {
		assert(!isProduction());
	});
});
