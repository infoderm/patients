import {assert} from 'chai';

import {randomUserId, server, throws} from '../../../_test/fixtures';

import {Documents} from '../../collection/documents';
import {newDocument} from '../../_dev/populate/documents';

import invoke from '../invoke';

import documentSuperdelete from './superdelete';

server(__filename, () => {
	it('cannot superdelete a document when not logged in', async () => {
		const userId = randomUserId();
		const documentId = await newDocument({userId});
		assert.strictEqual(await Documents.find().countAsync(), 1);
		await throws(
			async () =>
				invoke(documentSuperdelete, {userId: undefined!}, [documentId]),
			/not-authorized/,
		);
		assert.strictEqual(await Documents.find().countAsync(), 1);
	});

	it('cannot superdelete a document owned by another user', async () => {
		const userId = randomUserId();
		const documentId = await newDocument({userId: `${userId}x`});
		assert.strictEqual(await Documents.find().countAsync(), 1);
		await throws(
			async () => invoke(documentSuperdelete, {userId}, [documentId]),
			/not-found/,
		);
		assert.strictEqual(await Documents.find().countAsync(), 1);
	});

	it('cannot superdelete a document that does not exist', async () => {
		const userId = randomUserId();
		return throws(
			async () => invoke(documentSuperdelete, {userId}, ['x']),
			/not-found/,
		);
	});

	it('can superdelete a document', async () => {
		const userId = randomUserId();
		const documentAId = await newDocument({userId});
		const documentBId = await newDocument({userId});

		assert.strictEqual(await Documents.find().countAsync(), 2);
		await invoke(documentSuperdelete, {userId}, [documentAId]);
		assert.strictEqual(await Documents.find().countAsync(), 1);
		assert.strictEqual(
			await Documents.find({_id: documentAId}).countAsync(),
			0,
		);
		assert.strictEqual(
			await Documents.find({_id: documentBId}).countAsync(),
			1,
		);
		await invoke(documentSuperdelete, {userId}, [documentBId]);
		assert.strictEqual(await Documents.find().countAsync(), 0);
	});
});
