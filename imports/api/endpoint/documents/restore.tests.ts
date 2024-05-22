import {assert} from 'chai';

import {randomUserId, server, throws} from '../../../_test/fixtures';

import {Documents} from '../../collection/documents';
import {newDocument} from '../../_dev/populate/documents';

import invoke from '../invoke';

import documentDelete from './delete';
import documentRestore from './restore';

server(__filename, () => {
	it('cannot restore a document when not logged in', async () => {
		const userId = randomUserId();
		const documentId = await newDocument({userId});
		assert.strictEqual(await Documents.find().countAsync(), 1);
		await throws(
			async () => invoke(documentRestore, {userId: undefined!}, [documentId]),
			/not-authorized/,
		);
		assert.strictEqual(await Documents.find().countAsync(), 1);
	});

	it('cannot restore a document owned by another user', async () => {
		const userId = randomUserId();
		const documentId = await newDocument({userId: `${userId}x`});
		assert.strictEqual(await Documents.find().countAsync(), 1);
		await throws(
			async () => invoke(documentRestore, {userId}, [documentId]),
			/not-found/,
		);
		assert.strictEqual(await Documents.find().countAsync(), 1);
	});

	it('cannot restore a document that does not exist', async () => {
		const userId = randomUserId();
		return throws(
			async () => invoke(documentRestore, {userId}, ['x']),
			/not-found/,
		);
	});

	it('can restore a document', async () => {
		const userId = randomUserId();
		const documentAId = await newDocument({userId});
		const documentBId = await newDocument({userId});

		await invoke(documentDelete, {userId}, [documentAId]);
		await invoke(documentDelete, {userId}, [documentBId]);

		assert.strictEqual(await Documents.find().countAsync(), 2);
		await invoke(documentRestore, {userId}, [documentAId]);
		assert.strictEqual(await Documents.find().countAsync(), 2);
		assert.strictEqual(
			await Documents.find({_id: documentAId, deleted: false}).countAsync(),
			1,
		);
		assert.strictEqual(
			await Documents.find({_id: documentBId, deleted: true}).countAsync(),
			1,
		);
		await invoke(documentRestore, {userId}, [documentBId]);
		assert.strictEqual(await Documents.find().countAsync(), 2);
		assert.strictEqual(await Documents.find({deleted: false}).countAsync(), 2);
	});

	it('is idempotent', async () => {
		const userId = randomUserId();
		const documentId = await newDocument({userId});

		await invoke(documentRestore, {userId}, [documentId]);
		assert.strictEqual(await Documents.find({deleted: true}).countAsync(), 0);

		await invoke(documentDelete, {userId}, [documentId]);
		assert.strictEqual(await Documents.find({deleted: true}).countAsync(), 1);

		await invoke(documentRestore, {userId}, [documentId]);
		assert.strictEqual(await Documents.find({deleted: true}).countAsync(), 0);

		await invoke(documentRestore, {userId}, [documentId]);
		assert.strictEqual(await Documents.find({deleted: true}).countAsync(), 0);
	});
});
