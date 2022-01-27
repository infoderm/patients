// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';
import {assert} from 'chai';

import {randomUserId, server, throws} from '../../../test/fixtures';

import {Patients} from '../../collection/patients';
import {Documents} from '../../collection/documents';

import {newPatient} from '../../_dev/populate/patients';
import {newDocument} from '../../_dev/populate/documents';

import invoke from '../invoke';
import documentsUnlink from './unlink';

server(__filename, () => {
	it('can unlink document from patient', async () => {
		const userId = randomUserId();

		const patientAId = await newPatient({userId});
		const patientBId = await newPatient({userId});

		const documentAId = await newDocument({userId}, {patientId: patientAId});
		const documentBId = await newDocument({userId}, {patientId: patientBId});

		await invoke(documentsUnlink, {userId}, [documentAId]);

		assert.equal(Patients.find().count(), 2);
		assert.equal(Documents.find().count(), 2);

		assert.equal(
			Documents.findOne({
				patientId: patientAId,
			}),
			undefined,
		);

		assert.deepInclude(
			Documents.findOne({
				patientId: {$exists: false},
			}),
			{
				_id: documentAId,
			},
		);

		assert.deepInclude(
			Documents.findOne({
				patientId: patientBId,
			}),
			{
				_id: documentBId,
			},
		);

		assert.deepInclude(
			Documents.findOne({
				patientId: {$exists: true},
			}),
			{
				_id: documentBId,
			},
		);

		await invoke(documentsUnlink, {userId}, [documentBId]);

		assert.equal(Patients.find().count(), 2);
		assert.equal(Documents.find().count(), 2);

		assert.equal(
			Documents.findOne({
				patientId: patientAId,
			}),
			undefined,
		);

		assert.equal(
			Documents.findOne({
				patientId: patientBId,
			}),
			undefined,
		);
	});

	it('is idempotent', async () => {
		const userId = randomUserId();

		const patientId = await newPatient({userId});

		const documentId = await newDocument({userId}, {patientId});

		await invoke(documentsUnlink, {userId}, [documentId]);

		assert.equal(
			Documents.findOne({
				patientId: {$exists: true},
			}),
			undefined,
		);

		await invoke(documentsUnlink, {userId}, [documentId]);

		assert.equal(
			Documents.findOne({
				patientId: {$exists: true},
			}),
			undefined,
		);
	});

	it('cannot unlink non-owned document', async () => {
		const userId = randomUserId();

		const patientId = await newPatient({userId});

		const documentId = await newDocument({userId}, {patientId});

		return throws(
			async () => invoke(documentsUnlink, {userId: `${userId}x`}, [documentId]),
			/not-found/,
		);
	});

	it('cannot unlink upload from a patient when not logged in', async () => {
		const userId = randomUserId();

		const patientId = await newPatient({userId});

		const documentId = await newDocument({userId}, {patientId});

		return throws(
			async () => invoke(documentsUnlink, {userId: undefined}, [documentId]),
			/not-authorized/,
		);
	});
});
