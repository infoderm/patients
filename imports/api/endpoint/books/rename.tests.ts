// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';
import {assert} from 'chai';

import {Random} from 'meteor/random';

import invoke from '../invoke';
import {Consultations} from '../../collection/consultations';
import {Books} from '../../collection/books';
import {books} from '../../books';
import {server} from '../../../test/fixtures';
import {newPatient} from '../../_dev/populate/patients';
import {newConsultation} from '../../_dev/populate/consultations';
import bookRename from './rename';

server(__filename, () => {
	it('renaming a book updates its consultation', async () => {
		const userId = Random.id();

		const patientAId = await newPatient({userId});

		const {insertedId: consultationAId} = await newConsultation(
			{userId},
			{
				patientId: patientAId,
			},
		);

		const {datetime, book: oldBookNumber} =
			Consultations.findOne(consultationAId);

		const newBookNumber = `renamed-${oldBookNumber}`;

		const name = books.name(datetime, oldBookNumber);

		const {_id} = Books.findOne({name});

		await invoke(bookRename, {userId}, [_id, newBookNumber]);

		const {book: updatedBookNumber} = Consultations.findOne(consultationAId);

		assert.equal(updatedBookNumber, newBookNumber);
	});

	it('renaming a book updates its consultations', async () => {
		const userId = Random.id();

		const patientAId = await newPatient({userId});

		const {insertedId: consultationAId} = await newConsultation(
			{userId},
			{
				patientId: patientAId,
			},
		);

		const {datetime, book: oldBookNumber} =
			Consultations.findOne(consultationAId);

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

		const name = books.name(datetime, oldBookNumber);

		const {_id} = Books.findOne({name});

		await invoke(bookRename, {userId}, [_id, newBookNumber]);

		assert.equal(Consultations.findOne(consultationAId).book, newBookNumber);
		assert.equal(Consultations.findOne(consultationBId).book, newBookNumber);
		assert.equal(Consultations.findOne(consultationCId).book, newBookNumber);
	});

	it('renaming a book updates its consultations only', async () => {
		const userId = Random.id();

		const patientAId = await newPatient({userId});
		const patientXId = await newPatient({userId: `${userId}x`});

		const {insertedId: consultationAId} = await newConsultation(
			{userId},
			{
				patientId: patientAId,
			},
		);

		const {datetime, book: oldBookNumber} =
			Consultations.findOne(consultationAId);

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

		const name = books.name(datetime, oldBookNumber);

		const {_id} = Books.findOne({name, owner: userId});

		await invoke(bookRename, {userId}, [_id, newBookNumber]);

		assert.equal(Consultations.findOne(consultationAId).book, newBookNumber);
		assert.equal(Consultations.findOne(consultationBId).book, newBookNumber);
		assert.equal(Consultations.findOne(consultationCId).book, newBookNumber);

		assert.equal(Consultations.findOne(consultationDId).book, oldBookNumber);
		assert.equal(
			Consultations.findOne(consultationEId).book,
			`${oldBookNumber}x`,
		);
		assert.equal(
			Consultations.findOne(consultationFId).book,
			`${oldBookNumber}x`,
		);
	});
});
