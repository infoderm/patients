import {check} from 'meteor/check';

import {Appointments} from '../../collection/appointments';
import {appointments} from '../../appointments';

import define from '../define';

import {availability} from '../../availability';
import compose from '../compose';
import Wrapper from '../../transaction/Wrapper';
import createPatientForAppointment from './createPatient';

const {sanitize} = appointments;

export default define({
	name: 'appointments.schedule',
	validate(appointment: any) {
		check(appointment, Object);
	},
	async transaction(db: Wrapper, appointment: any) {
		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		const args = sanitize(appointment);

		if (args.createPatient) {
			args.consultationFields.patientId = await compose(
				db,
				createPatientForAppointment,
				this,
				[args.patientFields],
			);
		}

		const owner = this.userId;
		const {begin, end} = args.consultationFields;

		await availability.insertHook(db, owner, begin, end, 1);

		const createdAt = new Date();
		const lastModifiedAt = createdAt;

		const {insertedId: appointmentId} = await db.insertOne(Appointments, {
			...args.consultationFields,
			createdAt,
			lastModifiedAt,
			owner,
		});

		return {
			_id: appointmentId,
			patientId: args.consultationFields.patientId,
		};
	},
});
