// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';

import {assert} from 'chai';

import {isomorphic} from '../../_test/fixtures';
import {randomPNGDataURI} from '../../_test/png';

import blobFromDataURL from './blobFromDataURL';
import blobToDataURL from './blobToDataURL';

isomorphic(__filename, () => {
	it('should allow to convert back and forth from a dataURL', async () => {
		if (Meteor.isServer) {
			await import('../../../server/polyfill/fetch');
		}

		const url = randomPNGDataURI();

		const blob = await blobFromDataURL(url);
		assert.instanceOf(blob, Blob);

		const result = await blobToDataURL(blob);
		assert.equal(result, url);
	});
});
