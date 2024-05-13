import {assert} from 'chai';

import {randomUserId, server, throws} from '../../../_test/fixtures';

import {Attachments} from '../../collection/attachments';
import {newUpload} from '../../_dev/populate/uploads';

import invoke from '../invoke';

import uploadsDelete from './delete';

server(__filename, () => {
	it('can mark an upload as deleted', async () => {
		const userId = randomUserId();

		const {_id: uploadId} = await newUpload({userId});

		assert.notDeepNestedInclude(await Attachments.findOneAsync(uploadId), {
			'meta.isDeleted': true,
		});

		await invoke(uploadsDelete, {userId}, [uploadId]);

		assert.deepNestedInclude(await Attachments.findOneAsync(uploadId), {
			'meta.isDeleted': true,
		});
	});

	it('is idempotent', async () => {
		const userId = randomUserId();

		const {_id: uploadId} = await newUpload({userId});

		await invoke(uploadsDelete, {userId}, [uploadId]);

		await invoke(uploadsDelete, {userId}, [uploadId]);

		assert.deepNestedInclude(await Attachments.findOneAsync(uploadId), {
			'meta.isDeleted': true,
		});
	});

	it("cannot mark another user's upload as deleted", async () => {
		const userId = randomUserId();

		const {_id: uploadId} = await newUpload({userId});

		await throws(
			async () => invoke(uploadsDelete, {userId: `${userId}x`}, [uploadId]),
			/not-found/,
		);

		assert.notDeepNestedInclude(await Attachments.findOneAsync(uploadId), {
			'meta.isDeleted': true,
		});
	});

	it('cannot mark an upload as deleted if not logged in', async () => {
		const userId = randomUserId();

		const {_id: uploadId} = await newUpload({userId});

		await throws(
			async () => invoke(uploadsDelete, {userId: undefined!}, [uploadId]),
			/not-authorized/,
		);

		assert.notDeepNestedInclude(await Attachments.findOneAsync(uploadId), {
			'meta.isDeleted': true,
		});
	});
});
