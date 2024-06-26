import {assert} from 'chai';

import {randomUserId, server, throws} from '../../../_test/fixtures';

import {Patients} from '../../collection/patients';
import {Documents} from '../../collection/documents';

import {newPatient} from '../../_dev/populate/patients';
import {newDocument} from '../../_dev/populate/documents';

import invoke from '../invoke';

import documentsLink from './link';

server(__filename, () => {
	it('can link documents to patients', async () => {
		const userId = randomUserId();
		const invocation = {userId};

		const patientAId = await newPatient({userId});
		const patientBId = await newPatient({userId});
		await newPatient({userId});

		const documentAId = await newDocument({userId});
		const documentBId = await newDocument({userId});

		assert.strictEqual(await Patients.find().countAsync(), 3);
		assert.strictEqual(await Documents.find().countAsync(), 2);

		await invoke(documentsLink, invocation, [documentAId, patientAId]);
		await invoke(documentsLink, invocation, [documentBId, patientBId]);

		assert.deepNestedInclude(await Documents.findOneAsync(documentAId), {
			patientId: patientAId,
		});

		assert.deepNestedInclude(await Documents.findOneAsync(documentBId), {
			patientId: patientBId,
		});
		assert.strictEqual(await Patients.find().countAsync(), 3);
		assert.strictEqual(await Documents.find().countAsync(), 2);
	});

	it('is idempotent', async () => {
		const userId = randomUserId();

		const patientId = await newPatient({userId});

		const documentId = await newDocument({userId});

		assert.strictEqual(
			await Documents.findOneAsync({
				patientId,
			}),
			undefined,
		);

		await invoke(documentsLink, {userId}, [documentId, patientId]);

		assert.deepInclude(
			await Documents.findOneAsync({
				patientId,
			}),
			{
				_id: documentId,
			},
		);

		await invoke(documentsLink, {userId}, [documentId, patientId]);

		assert.deepInclude(
			await Documents.findOneAsync({
				patientId,
			}),
			{
				_id: documentId,
			},
		);
	});

	it('cannot link document to a patient that is not owned', async () => {
		const userId = randomUserId();

		const patientXId = await newPatient({userId: `${userId}x`});

		const documentId = await newDocument({userId});

		return throws(
			async () => invoke(documentsLink, {userId}, [documentId, patientXId]),
			/not-found/,
		);
	});

	it('cannot link non-owned document to a patient', async () => {
		const userId = randomUserId();

		const patientId = await newPatient({userId});

		const documentXId = await newDocument({userId: `${userId}x`});

		return throws(
			async () => invoke(documentsLink, {userId}, [patientId, documentXId]),
			/not-found/,
		);
	});

	it('cannot link document to a patient when both are not owned', async () => {
		const userId = randomUserId();

		const patientXId = await newPatient({userId: `${userId}x`});

		const documentXId = await newDocument({userId: `${userId}x`});

		return throws(
			async () => invoke(documentsLink, {userId}, [documentXId, patientXId]),
			/not-found/,
		);
	});

	it('cannot link document to a patient when not logged in', async () => {
		const userId = randomUserId();

		const patientId = await newPatient({userId});

		const documentId = await newDocument({userId});

		return throws(
			async () =>
				invoke(documentsLink, {userId: undefined!}, [documentId, patientId]),
			/not-authorized/,
		);
	});
});
