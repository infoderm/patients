// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';

import {assert} from 'chai';

import {client, server} from '../_test/fixtures';

import isNonAppTest from './isNonAppTest';

client(__filename, () => {
	it('should work on the client', () => {
		assert(isNonAppTest());
	});
});

server(__filename, () => {
	it('should work on the server', () => {
		assert(isNonAppTest());
	});
});
