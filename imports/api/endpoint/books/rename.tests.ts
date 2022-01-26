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
		const invocation = {userId};

		const patientAId = await newPatient({userId});

		const {insertedId: consultationAId} = await newConsultation(invocation, {
			patientId: patientAId,
		});

		const {datetime, book: oldBookNumber} =
			Consultations.findOne(consultationAId);

		const newBookNumber = `renamed-${oldBookNumber}`;

		const name = books.name(datetime, oldBookNumber);

		const {_id} = Books.findOne({name});

		await invoke(bookRename, invocation, [_id, newBookNumber]);

		const {book: updatedBookNumber} = Consultations.findOne(consultationAId);

		assert.equal(updatedBookNumber, newBookNumber);
	});

	it('renaming a book updates its consultations', async () => {
		const userId = Random.id();
		const invocation = {userId};

		const patientAId = await newPatient({userId});

		const {insertedId: consultationAId} = await newConsultation(invocation, {
			patientId: patientAId,
		});

		const {datetime, book: oldBookNumber} =
			Consultations.findOne(consultationAId);

		const {insertedId: consultationBId} = await newConsultation(invocation, {
			patientId: patientAId,
			datetime,
			book: oldBookNumber,
		});

		const {insertedId: consultationCId} = await newConsultation(invocation, {
			patientId: patientAId,
			datetime,
			book: oldBookNumber,
		});

		const newBookNumber = `renamed-${oldBookNumber}`;

		const name = books.name(datetime, oldBookNumber);

		const {_id} = Books.findOne({name});

		await invoke(bookRename, invocation, [_id, newBookNumber]);

		assert.equal(Consultations.findOne(consultationAId).book, newBookNumber);
		assert.equal(Consultations.findOne(consultationBId).book, newBookNumber);
		assert.equal(Consultations.findOne(consultationCId).book, newBookNumber);
	});
});
