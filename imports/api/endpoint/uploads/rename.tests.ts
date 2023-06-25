// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';

import {assert} from 'chai';

import {randomUserId, server, throws} from '../../../_test/fixtures';

import {Attachments} from '../../collection/attachments';
import {newUpload} from '../../_dev/populate/uploads';

import invoke from '../invoke';

import rename from './rename';

server(__filename, () => {
	it('can rename an upload', async () => {
		const userId = randomUserId();

		const before = 'a.png';
		const after = 'b.png';

		const {_id: uploadId} = await newUpload({userId}, {name: before});

		assert.deepInclude(await Attachments.findOneAsync(uploadId), {
			name: before,
		});

		await invoke(rename, {userId}, [uploadId, after]);

		assert.deepInclude(await Attachments.findOneAsync(uploadId), {
			name: after,
		});
	});

	it('is idempotent', async () => {
		const userId = randomUserId();

		const before = 'a.png';
		const after = 'b.png';

		const {_id: uploadId} = await newUpload({userId}, {name: before});

		await invoke(rename, {userId}, [uploadId, after]);
		await invoke(rename, {userId}, [uploadId, after]);

		assert.deepInclude(await Attachments.findOneAsync(uploadId), {
			name: after,
		});
	});

	it("cannot rename another user's upload as deleted", async () => {
		const userId = randomUserId();

		const before = 'a.png';
		const after = 'b.png';

		const {_id: uploadId} = await newUpload({userId}, {name: before});

		await throws(
			async () => invoke(rename, {userId: `${userId}x`}, [uploadId, after]),
			/not-found/,
		);

		assert.deepInclude(await Attachments.findOneAsync(uploadId), {
			name: before,
		});
	});

	it('cannot mark an upload as deleted if not logged in', async () => {
		const userId = randomUserId();

		const before = 'a.png';
		const after = 'b.png';

		const {_id: uploadId} = await newUpload({userId}, {name: before});

		await throws(
			async () => invoke(rename, {userId: undefined!}, [uploadId, after]),
			/not-authorized/,
		);

		assert.deepInclude(await Attachments.findOneAsync(uploadId), {
			name: before,
		});
	});
});
