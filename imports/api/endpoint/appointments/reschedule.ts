import {check} from 'meteor/check';
import {Mongo} from 'meteor/mongo';

import {Appointments} from '../../collection/appointments';
import {appointments} from '../../appointments';

import define from '../define';

import {availability} from '../../availability';
import {ConsultationDocument} from '../../collection/consultations';
import compose from '../compose';
import TransactionDriver from '../../transaction/TransactionDriver';
import createPatientForAppointment from './createPatient';

const {sanitize} = appointments;

export default define({
	name: 'appointments.reschedule',
	validate(appointmentId: string, appointment: any) {
		check(appointmentId, String);
		check(appointment, Object);
	},
	async transaction(
		db: TransactionDriver,
		appointmentId: string,
		appointment: any,
	) {
		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		const owner = this.userId;
		const item = await db.findOne(Appointments, {_id: appointmentId, owner});
		if (item === null) {
			throw new Meteor.Error('not-found');
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
		await availability.updateHook(
			db,
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

		await db.updateOne(Appointments, {_id: appointmentId}, modifier);

		return {
			_id: appointmentId,
			patientId: args.consultationFields.patientId,
		};
	},
});
