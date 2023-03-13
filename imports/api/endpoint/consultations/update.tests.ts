// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';
import {assert} from 'chai';

import {randomUserId, server, throws} from '../../../_test/fixtures';

import {Availability} from '../../collection/availability';
import {newPatient} from '../../_dev/populate/patients';
import {
	newConsultation,
	newConsultationFormData,
} from '../../_dev/populate/consultations';

import invoke from '../invoke';
import {Consultations} from '../../collection/consultations';
import update from './update';

server(__filename, () => {
	it('cannot update a consultation when not logged in', async () => {
		const userId = randomUserId();

		const patientId = await newPatient({userId});

		const {insertedId: consultationId} = await newConsultation(
			{userId},
			{patientId},
		);

		const newFields = newConsultationFormData({patientId});

		return throws(
			async () =>
				invoke(update, {userId: undefined!}, [consultationId, newFields]),
			/not-authorized/,
		);
	});

	it('cannot update a consultation by linking it to a non-existing patient', async () => {
		const userId = randomUserId();

		const patientId = await newPatient({userId});

		const {insertedId: consultationId} = await newConsultation(
			{userId},
			{patientId},
		);

		const newFields = newConsultationFormData({patientId: 'x'});

		return throws(
			async () => invoke(update, {userId}, [consultationId, newFields]),
			/not-found/,
		);
	});

	it("cannot update a consultation by linking it to another owner's patient", async () => {
		const userId = randomUserId();

		const patientId = await newPatient({userId});
		const patientXId = await newPatient({userId: `${userId}x`});

		const {insertedId: consultationId} = await newConsultation(
			{userId},
			{patientId},
		);

		const newFields = newConsultationFormData({patientId: patientXId});

		return throws(
			async () => invoke(update, {userId}, [consultationId, newFields]),
			/not-found/,
		);
	});

	it('updates unpaid flag', async () => {
		const userId = randomUserId();

		const patientId = await newPatient({userId});

		const price = 100;
		const paid = 0;

		assert.equal(await Consultations.findOneAsync(), undefined);

		const {insertedId: consultationId} = await newConsultation(
			{userId},
			{patientId, price, paid},
		);

		assert.deepInclude(
			await Consultations.findOneAsync({_id: consultationId}),
			{
				unpaid: true,
			},
		);

		const newFields = newConsultationFormData({patientId, price, paid: price});

		await invoke(update, {userId}, [consultationId, newFields]);

		assert.deepInclude(
			await Consultations.findOneAsync({_id: consultationId}),
			{
				unpaid: false,
			},
		);
	});

	it('does not fill availability', async () => {
		const userId = randomUserId();

		const patientId = await newPatient({userId});

		assert.equal(await Availability.find({owner: userId}).countAsync(), 0);

		const {insertedId: consultationId} = await newConsultation(
			{userId},
			{patientId},
		);

		assert.equal(await Availability.find({owner: userId}).countAsync(), 0);

		const newFields = newConsultationFormData({patientId});

		await invoke(update, {userId}, [consultationId, newFields]);

		assert.equal(await Availability.find({owner: userId}).countAsync(), 0);
	});
});
