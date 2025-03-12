import assert from 'assert';

import {Appointments} from '../../collection/appointments';
import {appointmentUpdate, sanitizeAppointmentUpdate} from '../../appointments';

import define from '../define';

import {availability} from '../../availability';
import {type ConsultationDocument} from '../../collection/consultations';
import compose from '../compose';
import type TransactionDriver from '../../transaction/TransactionDriver';
import {Patients} from '../../collection/patients';
import schema, {partial} from '../../../util/schema';
import type Modifier from '../../Modifier';
import {AuthenticationLoggedIn} from '../../Authentication';

import createPatientForAppointment from './createPatient';

export default define({
	name: 'appointments.reschedule',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([schema.string(), partial(appointmentUpdate)]),
	async transaction(db: TransactionDriver, appointmentId, appointment) {
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
			schema.date().parse($set.begin);
			schema.date().parse($set.end);
			schema.boolean().parse($set.isDone);
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

		const modifier: Modifier<ConsultationDocument> = {
			$set,
			$currentDate: {lastModifiedAt: true},
		};

		await db.updateOne(Appointments, {_id: appointmentId}, modifier);

		return {
			_id: appointmentId,
			patientId: $set.patientId ?? existing.patientId,
		};
	},
	simulate(_appointmentId, _appointment) {
		return undefined;
	},
});
