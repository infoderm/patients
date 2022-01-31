// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';
import {assert} from 'chai';

import {randomUserId, server, throws} from '../../../test/fixtures';

import {Documents} from '../../collection/documents';
import {newDocument} from '../../_dev/populate/documents';

import invoke from '../invoke';

import documentDelete from './delete';

server(__filename, () => {
	it('cannot delete a document when not logged in', async () => {
		const userId = randomUserId();
		const documentId = await newDocument({userId});
		assert.equal(Documents.find().count(), 1);
		await throws(
			async () => invoke(documentDelete, {userId: undefined}, [documentId]),
			/not-authorized/,
		);
		assert.equal(Documents.find().count(), 1);
	});

	it('cannot delete a document owned by another user', async () => {
		const userId = randomUserId();
		const documentId = await newDocument({userId: `${userId}x`});
		assert.equal(Documents.find().count(), 1);
		await throws(
			async () => invoke(documentDelete, {userId}, [documentId]),
			/not-found/,
		);
		assert.equal(Documents.find().count(), 1);
	});

	it('cannot delete a document that does not exist', async () => {
		const userId = randomUserId();
		return throws(
			async () => invoke(documentDelete, {userId}, ['x']),
			/not-found/,
		);
	});

	it('can delete a document', async () => {
		const userId = randomUserId();
		const documentAId = await newDocument({userId});
		const documentBId = await newDocument({userId});

		assert.equal(Documents.find().count(), 2);
		await invoke(documentDelete, {userId}, [documentAId]);
		assert.equal(Documents.find().count(), 2);
		assert.equal(Documents.find({deleted: true}).count(), 1);
		assert.equal(Documents.find({_id: documentAId, deleted: true}).count(), 1);
		await invoke(documentDelete, {userId}, [documentBId]);
		assert.equal(Documents.find().count(), 2);
		assert.equal(Documents.find({deleted: true}).count(), 2);
	});

	it('is idempotent', async () => {
		const userId = randomUserId();
		const documentId = await newDocument({userId});
		assert.equal(Documents.find({deleted: true}).count(), 0);

		await invoke(documentDelete, {userId}, [documentId]);
		assert.equal(Documents.find({deleted: true}).count(), 1);

		await invoke(documentDelete, {userId}, [documentId]);
		assert.equal(Documents.find({deleted: true}).count(), 1);
	});
});