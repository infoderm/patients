// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';

import {assert} from 'chai';

import {randomUserId, server, throws} from '../../../_test/fixtures';

import {Attachments} from '../../collection/attachments';
import {newUpload} from '../../_dev/populate/uploads';

import invoke from '../invoke';
import uploadsDelete from './delete';
import uploadsRestore from './restore';

server(__filename, () => {
	it('can restore an upload', async () => {
		const userId = randomUserId();

		const {_id: uploadId} = await newUpload({userId});

		await invoke(uploadsDelete, {userId}, [uploadId]);

		await invoke(uploadsRestore, {userId}, [uploadId]);

		assert.deepNestedInclude(await Attachments.findOneAsync(uploadId), {
			'meta.isDeleted': false,
		});
	});

	it('is idempotent', async () => {
		const userId = randomUserId();

		const {_id: uploadId} = await newUpload({userId});

		await invoke(uploadsRestore, {userId}, [uploadId]);

		assert.deepNestedInclude(await Attachments.findOneAsync(uploadId), {
			'meta.isDeleted': false,
		});

		await invoke(uploadsDelete, {userId}, [uploadId]);

		await invoke(uploadsRestore, {userId}, [uploadId]);

		await invoke(uploadsRestore, {userId}, [uploadId]);

		assert.deepNestedInclude(await Attachments.findOneAsync(uploadId), {
			'meta.isDeleted': false,
		});
	});

	it("cannot restore another user's upload", async () => {
		const userId = randomUserId();

		const {_id: uploadId} = await newUpload({userId});

		await invoke(uploadsDelete, {userId}, [uploadId]);

		await throws(
			async () => invoke(uploadsRestore, {userId: `${userId}x`}, [uploadId]),
			/not-found/,
		);

		assert.deepNestedInclude(await Attachments.findOneAsync(uploadId), {
			'meta.isDeleted': true,
		});
	});

	it('cannot mark an upload as deleted if not logged in', async () => {
		const userId = randomUserId();

		const {_id: uploadId} = await newUpload({userId});

		await invoke(uploadsDelete, {userId}, [uploadId]);

		await throws(
			async () => invoke(uploadsRestore, {userId: undefined!}, [uploadId]),
			/not-authorized/,
		);

		assert.deepNestedInclude(await Attachments.findOneAsync(uploadId), {
			'meta.isDeleted': true,
		});
	});
});
