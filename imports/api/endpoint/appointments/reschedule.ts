import {check} from 'meteor/check';

import {Appointments} from '../../collection/appointments';
import {appointments} from '../../appointments';

import invoke from '../invoke';

import define from '../define';

import createPatientForAppointment from './createPatient';

const {sanitize} = appointments;

export default define({
	name: 'appointments.reschedule',
	validate(appointmentId: string, appointment: any) {
		check(appointmentId, String);
		check(appointment, Object);
	},
	async run(appointmentId: string, appointment: any) {
		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		const item = Appointments.findOne({_id: appointmentId, owner: this.userId});
		if (!item) {
			throw new Meteor.Error('not-found');
		}

		const args = sanitize(appointment);

		if (args.createPatient) {
			args.consultationFields.patientId = await invoke(
				createPatientForAppointment,
				this,
				[args.patientFields],
			);
		}

		const fields = {
			...args.consultationFields,
		};

		Appointments.update(appointmentId, {$set: fields});

		return {
			_id: appointmentId,
			patientId: args.consultationFields.patientId,
		};
	},
});
