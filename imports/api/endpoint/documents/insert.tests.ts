// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';
// eslint-disable-next-line import/no-unassigned-import
import 'core-js/features/string/replace-all';
import {assert} from 'chai';

import {randomUserId, server, throws} from '../../../_test/fixtures';

import {Documents} from '../../collection/documents';
import {newPatient} from '../../_dev/populate/patients';

import invoke from '../invoke';
import {
	exampleHealthoneLab,
	exampleHealthoneReport,
} from '../../_dev/populate/documents';
import insert from './insert';

server(__filename, () => {
	it('cannot insert a document when not logged in', async () => {
		await throws(
			async () =>
				invoke(insert, {userId: undefined!}, [
					{
						array: new Uint8Array(0),
					},
				]),
			/not-authorized/,
		);

		assert.equal(await Documents.find().countAsync(), 0);
	});

	it('cannot insert a document linked to a non-existing patient', async () => {
		const userId = randomUserId();
		await throws(
			async () =>
				invoke(insert, {userId}, [
					{
						patientId: 'x',
						array: new Uint8Array(0),
					},
				]),
			/not-found/,
		);

		assert.equal(await Documents.find().countAsync(), 0);
	});

	it('cannot insert a document linked to a patient that is not owned', async () => {
		const userId = randomUserId();
		const patientId = await newPatient({userId: `${userId}x`});
		await throws(
			async () =>
				invoke(insert, {userId}, [
					{
						patientId,
						array: new Uint8Array(0),
					},
				]),
			/not-found/,
		);

		assert.equal(await Documents.find().countAsync(), 0);
	});

	it('can insert a document linked to a patient that is owned', async () => {
		const userId = randomUserId();
		const patientId = await newPatient({userId});
		const documentIds = await invoke(insert, {userId}, [
			{
				patientId,
				array: new TextEncoder().encode(exampleHealthoneLab.contents),
			},
		]);

		assert.equal(
			await Documents.find().countAsync(),
			exampleHealthoneLab.count,
		);
		for (const documentId of documentIds) {
			// eslint-disable-next-line no-await-in-loop
			assert.deepInclude(await Documents.findOneAsync(documentId), {
				patientId,
			});
		}
	});

	it('can automatically link to an owned patient', async () => {
		const userId = randomUserId();
		const firstname = 'Jane';
		const lastname = 'Doe';
		await newPatient({userId: `${userId}A`}, {firstname, lastname});
		const patientId = await newPatient({userId}, {firstname, lastname});
		await newPatient({userId: `${userId}B`}, {firstname, lastname});
		await invoke(insert, {userId}, [
			{
				array: new TextEncoder().encode(exampleHealthoneReport.contents),
			},
		]);

		assert.equal(
			await Documents.find().countAsync(),
			exampleHealthoneReport.count,
		);
		assert.equal(await Documents.find({patientId}).countAsync(), 1);
	});

	it('set patientId overwrites patient matching', async () => {
		const userId = randomUserId();
		const firstname = 'John';
		const lastname = 'Doe';
		const patientId = await newPatient({userId}, {firstname, lastname});
		await invoke(insert, {userId}, [
			{
				patientId,
				array: new TextEncoder().encode(exampleHealthoneReport.contents),
			},
		]);

		assert.equal(
			await Documents.find().countAsync(),
			exampleHealthoneReport.count,
		);
		assert.equal(
			await Documents.find({patientId}).countAsync(),
			exampleHealthoneReport.count,
		);
	});

	it('does not automatically link when multiple patients match', async () => {
		const userId = randomUserId();
		const firstname = 'Jane';
		const lastname = 'Doe';
		await newPatient({userId}, {firstname, lastname});
		await newPatient({userId}, {firstname, lastname});
		await invoke(insert, {userId}, [
			{
				array: new TextEncoder().encode(exampleHealthoneReport.contents),
			},
		]);

		assert.equal(
			await Documents.find().countAsync(),
			exampleHealthoneReport.count,
		);
		assert.equal(
			await Documents.find({patientId: {$exists: true}}).countAsync(),
			0,
		);
	});
});
