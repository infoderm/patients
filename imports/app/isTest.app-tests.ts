// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';

import {assert} from 'chai';

import {client, server} from '../_test/fixtures';

import isTest from './isTest';

client(__filename, () => {
	it('should work on the client', () => {
		assert(isTest());
	});
});

server(__filename, () => {
	it('should work on the server', () => {
		assert(isTest());
	});
});
