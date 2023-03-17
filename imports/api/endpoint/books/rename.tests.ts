// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';
import {assert} from 'chai';

import invoke from '../invoke';
import {Consultations} from '../../collection/consultations';
import {Books} from '../../collection/books';
import {books} from '../../books';
import {type NormalizedLine} from '../../string';
import {findOneOrThrow, randomUserId, server} from '../../../_test/fixtures';
import {newPatient} from '../../_dev/populate/patients';
import {newConsultation} from '../../_dev/populate/consultations';
import bookRename from './rename';

server(__filename, () => {
	it('renaming a book updates its consultation', async () => {
		const userId = randomUserId();

		const patientAId = await newPatient({userId});

		const {insertedId: consultationAId} = await newConsultation(
			{userId},
			{
				patientId: patientAId,
			},
		);

		const {datetime, book: oldBookNumber} = await findOneOrThrow(
			Consultations,
			consultationAId,
		);

		const newBookNumber = `renamed-${oldBookNumber}`;

		const name = books.name(datetime, oldBookNumber) as NormalizedLine;

		const {_id} = await findOneOrThrow(Books, {name});

		await invoke(bookRename, {userId}, [_id, newBookNumber]);

		const {book: updatedBookNumber} = await findOneOrThrow(
			Consultations,
			consultationAId,
		);

		assert.equal(updatedBookNumber, newBookNumber);
	});

	it('renaming a book updates its consultations', async () => {
		const userId = randomUserId();

		const patientAId = await newPatient({userId});

		const {insertedId: consultationAId} = await newConsultation(
			{userId},
			{
				patientId: patientAId,
			},
		);

		const {datetime, book: oldBookNumber} = await findOneOrThrow(
			Consultations,
			consultationAId,
		);

		const {insertedId: consultationBId} = await newConsultation(
			{userId},
			{
				patientId: patientAId,
				datetime,
				book: oldBookNumber,
			},
		);

		const {insertedId: consultationCId} = await newConsultation(
			{userId},
			{
				patientId: patientAId,
				datetime,
				book: oldBookNumber,
			},
		);

		const newBookNumber = `renamed-${oldBookNumber}`;

		const name = books.name(datetime, oldBookNumber) as NormalizedLine;

		const {_id} = await findOneOrThrow(Books, {name});

		await invoke(bookRename, {userId}, [_id, newBookNumber]);

		for (const consultationId of [
			consultationAId,
			consultationBId,
			consultationCId,
		]) {
			// eslint-disable-next-line no-await-in-loop
			const {book} = await findOneOrThrow(Consultations, consultationId);
			assert.equal(book, newBookNumber);
		}
	});

	it('renaming a book updates its consultations only', async () => {
		const userId = randomUserId();

		const patientAId = await newPatient({userId});
		const patientXId = await newPatient({userId: `${userId}x`});

		const {insertedId: consultationAId} = await newConsultation(
			{userId},
			{
				patientId: patientAId,
			},
		);

		const {datetime, book: oldBookNumber} = await findOneOrThrow(
			Consultations,
			consultationAId,
		);

		const {insertedId: consultationBId} = await newConsultation(
			{userId},
			{
				patientId: patientAId,
				datetime,
				book: oldBookNumber,
			},
		);

		const {insertedId: consultationCId} = await newConsultation(
			{userId},
			{
				patientId: patientAId,
				datetime,
				book: oldBookNumber,
			},
		);

		const {insertedId: consultationDId} = await newConsultation(
			{userId: `${userId}x`},
			{
				patientId: patientXId,
				datetime,
				book: oldBookNumber,
			},
		);

		const {insertedId: consultationEId} = await newConsultation(
			{userId},
			{
				patientId: patientAId,
				datetime,
				book: `${oldBookNumber}x`,
			},
		);

		const {insertedId: consultationFId} = await newConsultation(
			{userId: `${userId}x`},
			{
				patientId: patientXId,
				datetime,
				book: `${oldBookNumber}x`,
			},
		);

		const newBookNumber = `renamed-${oldBookNumber}`;

		const name = books.name(datetime, oldBookNumber) as NormalizedLine;

		const {_id} = await findOneOrThrow(Books, {name, owner: userId});

		await invoke(bookRename, {userId}, [_id, newBookNumber]);

		for (const consultationId of [
			consultationAId,
			consultationBId,
			consultationCId,
		]) {
			// eslint-disable-next-line no-await-in-loop
			const {book} = await findOneOrThrow(Consultations, consultationId);
			assert.equal(book, newBookNumber);
		}

		for (const consultationId of [consultationDId]) {
			// eslint-disable-next-line no-await-in-loop
			const {book} = await findOneOrThrow(Consultations, consultationId);
			assert.equal(book, oldBookNumber);
		}

		for (const consultationId of [consultationEId, consultationFId]) {
			// eslint-disable-next-line no-await-in-loop
			const {book} = await findOneOrThrow(Consultations, consultationId);
			assert.equal(book, `${oldBookNumber}x`);
		}
	});
});
