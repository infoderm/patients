// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';
import {assert} from 'chai';

import {randomUserId, server, throws} from '../../../test/fixtures';

import {Books} from '../../collection/books';
import {Availability} from '../../collection/availability';
import {type NormalizedLine} from '../../string';
import {newPatient} from '../../_dev/populate/patients';
import {newConsultation} from '../../_dev/populate/consultations';

import {books} from '../../books';

server(__filename, () => {
	it('cannot create a consultation when not logged in', async () => {
		const userId = randomUserId();

		const patientAId = await newPatient({userId});

		return throws(
			async () => newConsultation({userId: undefined}, {patientId: patientAId}),
			/not-authorized/,
		);
	});

	it('cannot create a consultation linked to non-existing patient', async () => {
		const userId = randomUserId();

		return throws(
			async () => newConsultation({userId}, {patientId: 'x'}),
			/not-found/,
		);
	});

	it("cannot create a consultation linked to another owner's patient", async () => {
		const userId = randomUserId();

		const patientXId = await newPatient({userId: `${userId}x`});

		return throws(
			async () => newConsultation({userId}, {patientId: patientXId}),
			/not-found/,
		);
	});

	it('creates associated book', async () => {
		const userId = randomUserId();

		const patientId = await newPatient({userId});

		const datetime = new Date();
		const book = 'test-book-id';

		const bookName = books.name(datetime, book) as NormalizedLine;

		assert.equal(Books.findOne({name: bookName, owner: userId}), undefined);

		await newConsultation(
			{userId},
			{
				patientId,
				datetime,
				book,
			},
		);

		assert.notEqual(Books.findOne({name: bookName, owner: userId}), undefined);
	});

	it('does not fill availability', async () => {
		const userId = randomUserId();

		const patientId = await newPatient({userId});

		assert.equal(Availability.find({owner: userId}).count(), 0);

		await newConsultation(
			{userId},
			{
				patientId,
			},
		);

		assert.equal(Availability.find({owner: userId}).count(), 0);
	});
});
