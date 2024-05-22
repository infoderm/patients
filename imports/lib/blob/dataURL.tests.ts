import {assert} from 'chai';

import {isomorphic} from '../../_test/fixtures';
import {randomPNGDataURI} from '../../_test/png';

import blobFromDataURL from './blobFromDataURL';
import blobToDataURL from './blobToDataURL';

isomorphic(__filename, () => {
	it('should allow to convert back and forth from a dataURL', async () => {
		const url = randomPNGDataURI();

		const blob = await blobFromDataURL(url);
		assert.instanceOf(blob, Blob);

		const result = await blobToDataURL(blob);
		assert.strictEqual(result, url);
	});
});
