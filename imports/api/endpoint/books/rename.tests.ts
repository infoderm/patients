// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';
import {assert} from 'chai';

import {Meteor} from 'meteor/meteor';
import {Random} from 'meteor/random';

import invoke from '../invoke';
import {newPatient} from '../../collection/patients.mock';
import {
	Consultations,
	newConsultation,
} from '../../collection/consultations.mock';
import {Books} from '../../collection/books.mock';
import {books} from '../../books';
import bookRename from './rename';

if (Meteor.isServer) {
	describe('endpoint', () => {
		describe('books', () => {
			describe('rename', () => {
				beforeEach(() => {
					Consultations.remove({});
					Books.remove({});
				});

				it('renaming a book updates its consultation', async () => {
					const userId = Random.id();
					const invocation = {userId};

					const patientAId = await newPatient({userId});

					const {insertedId: consultationAId} = await newConsultation(
						invocation,
						{patientId: patientAId},
					);

					const {datetime, book: oldBookNumber} =
						Consultations.findOne(consultationAId);

					const newBookNumber = `renamed-${oldBookNumber}`;

					const name = books.name(datetime, oldBookNumber);

					const {_id} = Books.findOne({name});

					await invoke(bookRename, invocation, [_id, newBookNumber]);

					const {book: updatedBookNumber} =
						Consultations.findOne(consultationAId);

					assert.equal(updatedBookNumber, newBookNumber);
				});

				it('renaming a book updates its consultations', async () => {
					const userId = Random.id();
					const invocation = {userId};

					const patientAId = await newPatient({userId});

					const {insertedId: consultationAId} = await newConsultation(
						invocation,
						{patientId: patientAId},
					);

					const {datetime, book: oldBookNumber} =
						Consultations.findOne(consultationAId);

					const {insertedId: consultationBId} = await newConsultation(
						invocation,
						{patientId: patientAId, datetime, book: oldBookNumber},
					);

					const {insertedId: consultationCId} = await newConsultation(
						invocation,
						{patientId: patientAId, datetime, book: oldBookNumber},
					);

					const newBookNumber = `renamed-${oldBookNumber}`;

					const name = books.name(datetime, oldBookNumber);

					const {_id} = Books.findOne({name});

					await invoke(bookRename, invocation, [_id, newBookNumber]);

					assert.equal(
						Consultations.findOne(consultationAId).book,
						newBookNumber,
					);
					assert.equal(
						Consultations.findOne(consultationBId).book,
						newBookNumber,
					);
					assert.equal(
						Consultations.findOne(consultationCId).book,
						newBookNumber,
					);
				});
			});
		});
	});
}