// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';
import {assert} from 'chai';

import {dropIds, randomUserId, server, throws} from '../../../test/fixtures';

import {beginningOfTime, endOfTime} from '../../../util/datetime';

import {Appointments} from '../../collection/appointments';
import {Availability} from '../../collection/availability';
import {Patients} from '../../collection/patients';
import {newAppointment} from '../../_dev/populate/appointments';
import {newPatient} from '../../_dev/populate/patients';

import {slot} from '../../availability';

server(__filename, () => {
	it('cannot schedule appointment when not logged in', async () => {
		return throws(
			async () => newAppointment({userId: undefined}),
			/not-authorized/,
		);
	});

	it('cannot schedule an appointment linked to non-existing patient', async () => {
		const userId = randomUserId();

		const patient = {
			_id: 'x',
			firstname: 'Jane',
			lastname: 'Doe',
		};

		return throws(async () => newAppointment({userId}, {patient}), /not-found/);
	});

	it("cannot schedule an appointment linked to another owner's patient", async () => {
		const userId = randomUserId();

		const patientXId = await newPatient({userId: `${userId}x`});

		const patient = Patients.findOne(patientXId);

		return throws(async () => newAppointment({userId}, {patient}), /not-found/);
	});

	it('can schedule an appointment linked to own patient', async () => {
		const userId = randomUserId();

		const patientId = await newPatient({userId});

		const patient = Patients.findOne(patientId);

		const appointmentId = await newAppointment({userId}, {patient});

		assert.deepInclude(Appointments.findOne(appointmentId), {patientId});
	});

	it('creates associated patient', async () => {
		const userId = randomUserId();

		assert.equal(Patients.findOne(), undefined);

		const patientFields = {
			firstname: 'Jane',
			lastname: 'Doe',
		};

		const phone = 'test-phone-number';

		const patient = {
			_id: '?',
			...patientFields,
		};

		const appointmentId = await newAppointment({userId}, {patient, phone});

		const {patientId} = Appointments.findOne(appointmentId);

		assert.deepInclude(Patients.findOne(patientId), {
			...patientFields,
			phone,
		});
	});

	it('fills availability', async () => {
		const userId = randomUserId();

		await newAppointment({userId});

		const {begin, end} = Appointments.findOne();

		const actual = Availability.find().fetch();

		assert.sameDeepMembers(dropIds(actual), [
			{
				...slot(beginningOfTime(), begin, 0),
				owner: userId,
			},
			{
				...slot(begin, end, 1),
				owner: userId,
			},
			{
				...slot(end, endOfTime(), 0),
				owner: userId,
			},
		]);
	});
});
