import {Readable} from 'stream';

import {LRUCache as MemoryLRU} from 'lru-cache';

import {type FileObj} from 'meteor/ostrio:files';
import {assert} from 'chai';

import {randomPDFUint8Array} from '../_test/pdf';
import {server} from '../_test/fixtures';
import streamToBuffer from '../util/stream/streamToBuffer';
import {
	assertEqual as assertEqualImages,
	whiteRectanglePNG,
} from '../_test/image';
import bufferToUint8ArrayView from '../util/buffer/bufferToUint8ArrayView';
import {randomPNGBuffer} from '../_test/png';

import {cacheKey, type MetadataType, thumbify} from './uploads';

const width = 200;
const height = 200;

server(__filename, () => {
	it('should allow to create PDFs thumbnails', async () => {
		const cache = new MemoryLRU<string, Uint8Array>({max: 1});
		const source = () => Readable.from([randomPDFUint8Array()]);
		const output = await thumbify(
			{
				_id: 'test',
				isImage: false,
				isPDF: true,
			} as FileObj<MetadataType>,
			source,
			{minWidth: width, minHeight: height},
			cache,
		);
		assert.instanceOf(output, Readable);

		const buffer = await streamToBuffer(output);
		const expected = await whiteRectanglePNG({width, height});

		await assertEqualImages(buffer, expected);
	});

	it('should use cached PDFs thumbnails', async () => {
		const upload = {
			_id: 'test',
			isImage: false,
			isPDF: true,
		} as FileObj<MetadataType>;

		const source = () => {
			throw new Error('cache miss');
		};

		const size = {minWidth: width, minHeight: height};

		const cache = new MemoryLRU<string, Uint8Array>({max: 1});
		const expected = await randomPNGBuffer();
		const thumbnail = bufferToUint8ArrayView(expected);
		cache.set(cacheKey(upload, size), thumbnail);

		const output = await thumbify(upload, source, size, cache);
		assert.instanceOf(output, Readable);

		const buffer = await streamToBuffer(output);

		assert.deepEqual(buffer, expected);
	});
});
