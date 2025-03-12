import {Buffer} from 'buffer';
import {Readable} from 'stream';

import {assert} from 'chai';

import {client, server, throws} from '../../_test/fixtures';
import {randomPDFUint8Array, randomPDFDataURI} from '../../_test/pdf';
import {
	assertEqual as assertEqualImages,
	whiteRectanglePNG,
} from '../../_test/image';

import blobFromDataURL from '../blob/blobFromDataURL';
import blobToBuffer from '../blob/blobToBuffer';
import streamToBuffer from '../stream/streamToBuffer';

import {
	thumbnailDataURL,
	thumbnailStream,
	thumbnailBlob,
	thumbnailBuffer,
} from './pdfthumbnails';

const width = 200;
const height = 200;

client(__filename, () => {
	it('thumbnailDataURL should work', async () => {
		const pdfDataURL = await randomPDFDataURI();
		const pngDataURL = await thumbnailDataURL(
			pdfDataURL,
			{minWidth: width, minHeight: height},
			{type: 'image/png'},
		);

		assert.typeOf(pngDataURL, 'string');

		const buffer = await blobFromDataURL(pngDataURL).then(blobToBuffer);
		const expected = await whiteRectanglePNG({width, height});

		await assertEqualImages(buffer, expected);
	});

	it('thumbnailBlob should work', async () => {
		const data = randomPDFUint8Array();
		const blob = await thumbnailBlob(
			{data},
			{minWidth: width, minHeight: height},
			{type: 'image/png'},
		);
		assert.instanceOf(blob, Blob);

		const buffer = await blobToBuffer(blob);
		const expected = await whiteRectanglePNG({width, height});

		await assertEqualImages(buffer, expected);
	});

	it('thumbnailBuffer should NOT be implemented', async () => {
		const data = randomPDFUint8Array();
		await throws(
			async () =>
				thumbnailBuffer(
					{data},
					{minWidth: width, minHeight: height},
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
					{minWidth: width, minHeight: height},
					{type: 'image/png'},
				),
			/not implemented/i,
		);
	});
});

server(__filename, () => {
	it('thumbnailDataURL should NOT be implemented', async () => {
		const url = await randomPDFDataURI();

		await throws(
			async () =>
				thumbnailDataURL(
					url,
					{minWidth: width, minHeight: height},
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
					{minWidth: width, minHeight: height},
					{type: 'image/png'},
				),
			/not implemented/i,
		);
	});

	it('thumbnailBuffer should work', async () => {
		const data = randomPDFUint8Array();
		const buffer = await thumbnailBuffer(
			{data},
			{minWidth: width, minHeight: height},
			{type: 'image/png'},
		);
		assert.instanceOf(buffer, Buffer);

		const expected = await whiteRectanglePNG({width, height});

		await assertEqualImages(buffer, expected);
	});

	it('thumbnailStream should work', async () => {
		const data = randomPDFUint8Array();
		const stream = await thumbnailStream(
			{data},
			{minWidth: width, minHeight: height},
			{type: 'image/png'},
		);
		assert.instanceOf(stream, Readable);

		const buffer = await streamToBuffer(stream);

		const expected = await whiteRectanglePNG({width, height});

		await assertEqualImages(buffer, expected);
	});
});
