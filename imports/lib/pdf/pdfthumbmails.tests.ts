import {Buffer} from 'buffer';
import {Readable} from 'stream';

// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';

import {assert} from 'chai';

import {client, server, throws} from '../../_test/fixtures';

import dataURL from '../dataURL';
import blobToDataURL from '../blob/blobToDataURL';

import {
	thumbnailDataURL,
	thumbnailStream,
	thumbnailBlob,
	thumbnailBuffer,
} from './pdfthumbnails';

const document = `%PDF-1.0
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/MediaBox[0 0 3 3]>>endobj
xref
0 4
0000000000 65535 f
0000000009 00000 n
0000000052 00000 n
0000000101 00000 n
trailer<</Size 4/Root 1 0 R>>
startxref
147
%EOF
`;

client(__filename, () => {
	it('thumbnailDataURL should work', async () => {
		const data = new TextEncoder().encode(document);
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
		const data = new TextEncoder().encode(document);
		const result = await thumbnailBlob(
			{data},
			{minWidth: 200, minHeight: 200},
			{type: 'image/png'},
		);
		assert.instanceOf(result, Blob);
	});

	it('thumbnailBuffer should NOT be implemented', async () => {
		const data = new TextEncoder().encode(document);
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
		const data = new TextEncoder().encode(document);
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
		const data = new TextEncoder().encode(document);
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
		const data = new TextEncoder().encode(document);

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
		const data = new TextEncoder().encode(document);
		const result = await thumbnailBuffer(
			{data},
			{minWidth: 200, minHeight: 200},
			{type: 'image/png'},
		);
		assert.instanceOf(result, Buffer);
	});

	it('thumbnailStream should work', async () => {
		const data = new TextEncoder().encode(document);
		const result = await thumbnailStream(
			{data},
			{minWidth: 200, minHeight: 200},
			{type: 'image/png'},
		);
		assert.instanceOf(result, Readable);
	});
});
