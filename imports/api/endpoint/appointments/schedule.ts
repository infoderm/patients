import {check} from 'meteor/check';

import {Appointments} from '../../collection/appointments';
import {Patients} from '../../collection/patients';
import {appointments} from '../../appointments';
import {availability} from '../../availability';

import TransactionDriver from '../../transaction/TransactionDriver';

import define from '../define';
import compose from '../compose';

import createPatientForAppointment from './createPatient';

const {sanitize} = appointments;

export default define({
	name: 'appointments.schedule',
	validate(appointment: any) {
		check(appointment, Object);
	},
	async transaction(db: TransactionDriver, appointment: any) {
		const args = sanitize(appointment);

		const owner = this.userId;

		if (args.createPatient) {
			args.consultationFields.patientId = await compose(
				db,
				createPatientForAppointment,
				this,
				[args.patientFields],
			);
		} else {
			const patient = await db.findOne(Patients, {
				_id: args.consultationFields.patientId,
				owner,
			});
			if (patient === null) {
				throw new Meteor.Error('not-found');
			}
		}

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
	simulate(_appointment: any): void {
		return undefined;
	},
});
