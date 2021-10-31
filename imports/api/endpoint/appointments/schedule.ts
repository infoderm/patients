import {check} from 'meteor/check';

import {Appointments} from '../../collection/appointments';
import {appointments} from '../../appointments';

import invoke from '../invoke';

import define from '../define';

import {availability} from '../../availability';
import createPatientForAppointment from './createPatient';

const {sanitize} = appointments;

export default define({
	name: 'appointments.schedule',
	validate(appointment: any) {
		check(appointment, Object);
	},
	async run(appointment: any) {
		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		const args = sanitize(appointment);

		if (args.createPatient) {
			args.consultationFields.patientId = await invoke(
				createPatientForAppointment,
				this,
				[args.patientFields],
			);
		}

		const owner = this.userId;
		const {begin, end} = args.consultationFields;

		availability.insertHook(owner, begin, end, 1);

		const createdAt = new Date();
		const lastModifiedAt = createdAt;

		const appointmentId = Appointments.insert({
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
