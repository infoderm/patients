import assert from 'assert';
import {type Mongo} from 'meteor/mongo';

import {Appointments} from '../../collection/appointments';
import {sanitizeAppointmentUpdate} from '../../appointments';

import define from '../define';

import {availability} from '../../availability';
import {type ConsultationDocument} from '../../collection/consultations';
import compose from '../compose';
import type TransactionDriver from '../../transaction/TransactionDriver';
import {Patients} from '../../collection/patients';
import {validate} from '../../../util/schema';
import createPatientForAppointment from './createPatient';

export default define({
	name: 'appointments.reschedule',
	validate(appointmentId: string, appointment: any) {
		validate(appointmentId, String);
		validate(appointment, Object);
	},
	async transaction(
		db: TransactionDriver,
		appointmentId: string,
		appointment: any,
	) {
		const owner = this.userId;
		const existing = await db.findOne(Appointments, {
			_id: appointmentId,
			owner,
		});
		if (existing === null) {
			throw new Meteor.Error('not-found');
		}

		const {
			createPatient,
			consultationUpdate: {$set, $unset},
		} = sanitizeAppointmentUpdate(appointment);

		assert($unset === undefined || Object.keys($unset).length === 0);

		if (createPatient) {
			$set.patientId = await compose(db, createPatientForAppointment, this, [
				createPatient,
			]);
		} else if ($set.patientId !== undefined) {
			const patient = await db.findOne(Patients, {
				_id: $set.patientId,
				owner,
			});
			if (patient === null) {
				throw new Meteor.Error('not-found');
			}
		}

		if ($set.datetime !== undefined || $set.duration !== undefined) {
			validate($set.begin, Date);
			validate($set.end, Date);
			validate($set.isDone, Boolean);
			const {
				begin: oldBegin,
				end: oldEnd,
				isDone: oldIsDone,
				isCancelled: oldIsCancelled,
			} = existing;
			const oldWeight = oldIsDone || oldIsCancelled ? 0 : 1;
			const newBegin = $set.begin ?? oldBegin;
			const newEnd = $set.end ?? oldEnd;
			const newIsDone = $set.isDone ?? oldIsDone;
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
		}

		const modifier: Mongo.Modifier<ConsultationDocument> = {
			$set,
			$currentDate: {lastModifiedAt: true},
		};

		await db.updateOne(Appointments, {_id: appointmentId}, modifier);

		return {
			_id: appointmentId,
			patientId: $set.patientId ?? existing.patientId,
		};
	},
	simulate(_appointmentId: string, _appointment: any) {
		return undefined;
	},
});
