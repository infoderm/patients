import {Buffer} from 'buffer';
import {Readable} from 'stream';

// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';

import {assert} from 'chai';

import {client, server, throws} from '../../_test/fixtures';
import {randomPDFUint8Array} from '../../_test/pdf';

import dataURL from '../dataURL';
import blobToDataURL from '../blob/blobToDataURL';

import {
	thumbnailDataURL,
	thumbnailStream,
	thumbnailBlob,
	thumbnailBuffer,
} from './pdfthumbnails';

client(__filename, () => {
	it('thumbnailDataURL should work', async () => {
		const data = randomPDFUint8Array();
		const blob = new Blob([data.buffer], {type: 'application/pdf'});
		const url = await blobToDataURL(blob);
		const result = await thumbnailDataURL(
			url,
			{minWidth: 10, minHeight: 10},
			{type: 'image/png'},
		);
		const expected = dataURL(
			'image/png',
			'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAAAXSURBVBhXY/wPBAxEAMZRhfhCifrBAwDBjyfjq7VgpgAAAABJRU5ErkJggg==',
		);
		assert.equal(result, expected);
	});

	it('thumbnailBlob should work', async () => {
		const data = randomPDFUint8Array();
		const result = await thumbnailBlob(
			{data},
			{minWidth: 200, minHeight: 200},
			{type: 'image/png'},
		);
		assert.instanceOf(result, Blob);
	});

	it('thumbnailBuffer should NOT be implemented', async () => {
		const data = randomPDFUint8Array();
		await throws(
			async () =>
				thumbnailBuffer(
					{data},
					{minWidth: 200, minHeight: 200},
					{type: 'image/png'},
				),
			/not implemented/i,
		);
	});

	it('thumbnailStream should NOT be implemented', async () => {
		const data = randomPDFUint8Array();
		await throws(
			async () =>
				thumbnailStream(
					{data},
					{minWidth: 200, minHeight: 200},
					{type: 'image/png'},
				),
			/not implemented/i,
		);
	});
});

server(__filename, () => {
	it('thumbnailDataURL should NOT be implemented', async () => {
		const data = randomPDFUint8Array();
		const buffer = Buffer.from(data).toString('base64');
		const url = dataURL('image/png', buffer);

		await throws(
			async () =>
				thumbnailDataURL(
					url,
					{minWidth: 200, minHeight: 200},
					{type: 'image/png'},
				),
			/not implemented/i,
		);
	});

	it('thumbnailBlob should work', async () => {
		const data = randomPDFUint8Array();

		await throws(
			async () =>
				thumbnailBlob(
					{data},
					{minWidth: 200, minHeight: 200},
					{type: 'image/png'},
				),
			/not implemented/i,
		);
	});

	it('thumbnailBuffer should work', async () => {
		const data = randomPDFUint8Array();
		const result = await thumbnailBuffer(
			{data},
			{minWidth: 200, minHeight: 200},
			{type: 'image/png'},
		);
		assert.instanceOf(result, Buffer);
	});

	it('thumbnailStream should work', async () => {
		const data = randomPDFUint8Array();
		const result = await thumbnailStream(
			{data},
			{minWidth: 200, minHeight: 200},
			{type: 'image/png'},
		);
		assert.instanceOf(result, Readable);
	});
});
