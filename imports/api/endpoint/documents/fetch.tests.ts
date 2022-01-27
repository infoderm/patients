// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';
import {assert} from 'chai';

import {randomUserId, server, throws} from '../../../test/fixtures';

import {exampleMedidocReport} from '../../_dev/populate/documents';

import invoke from '../invoke';

import documentInsert from './insert';
import documentFetch from './fetch';

server(__filename, () => {
	it('cannot fetch a document when not logged in', async () => {
		const userId = randomUserId();
		const [documentId] = await invoke(documentInsert, {userId}, [
			{
				array: new TextEncoder().encode(exampleMedidocReport.contents),
			},
		]);

		return throws(
			async () => invoke(documentFetch, {userId: undefined}, [documentId]),
			/not-authorized/,
		);
	});

	it('cannot fetch a document owned by another user', async () => {
		const userId = randomUserId();
		const [documentId] = await invoke(documentInsert, {userId: `${userId}x`}, [
			{
				array: new TextEncoder().encode(exampleMedidocReport.contents),
			},
		]);

		return throws(
			async () => invoke(documentFetch, {userId}, [documentId]),
			/not-found/,
		);
	});

	it('can fetch a document', async () => {
		const userId = randomUserId();
		const [documentId] = await invoke(documentInsert, {userId}, [
			{
				array: new TextEncoder().encode(exampleMedidocReport.contents),
			},
		]);

		assert.equal(
			await invoke(documentFetch, {userId}, [documentId]),
			exampleMedidocReport.contents,
		);
	});
});
