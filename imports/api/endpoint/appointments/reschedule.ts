import {check} from 'meteor/check';
import {Mongo} from 'meteor/mongo';

import {Appointments} from '../../collection/appointments';
import {appointments} from '../../appointments';

import invoke from '../invoke';

import define from '../define';

import {availability} from '../../availability';
import {ConsultationDocument} from '../../collection/consultations';
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

		const owner = this.userId;
		const item = Appointments.findOne({_id: appointmentId, owner});
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

		const {
			begin: oldBegin,
			end: oldEnd,
			isDone: oldIsDone,
			isCancelled: oldIsCancelled,
		} = item;
		const oldWeight = oldIsDone || oldIsCancelled ? 0 : 1;
		const newBegin = fields.begin ?? oldBegin;
		const newEnd = fields.end ?? oldEnd;
		const newIsDone = fields.isDone ?? oldIsDone;
		const newIsCancelled = oldIsCancelled;
		const newWeight = newIsDone || newIsCancelled ? 0 : 1;
		availability.updateHook(
			owner,
			oldBegin,
			oldEnd,
			oldWeight,
			newBegin,
			newEnd,
			newWeight,
		);

		const modifier: Mongo.Modifier<ConsultationDocument> = {
			$set: fields,
			$currentDate: {lastModifiedAt: true},
		};

		Appointments.update(appointmentId, modifier);

		return {
			_id: appointmentId,
			patientId: args.consultationFields.patientId,
		};
	},
});
