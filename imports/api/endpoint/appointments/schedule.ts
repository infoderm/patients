import assert from 'assert';

import {Appointments} from '../../collection/appointments';
import {Patients} from '../../collection/patients';
import {sanitizeAppointmentUpdate, appointmentUpdate} from '../../appointments';
import {availability} from '../../availability';

import type TransactionDriver from '../../transaction/TransactionDriver';
import schema from '../../../lib/schema';

import define from '../define';
import compose from '../compose';

import {AuthenticationLoggedIn} from '../../Authentication';

import createPatientForAppointment from './createPatient';

export default define({
	name: 'appointments.schedule',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([appointmentUpdate]),
	async transaction(db: TransactionDriver, appointment) {
		const {
			createPatient,
			consultationUpdate: {$set, $unset},
		} = sanitizeAppointmentUpdate(appointment);

		assert($unset === undefined || Object.keys($unset).length === 0);
		assert($set !== undefined);
		assert($set.begin instanceof Date);
		assert($set.end instanceof Date);
		assert(typeof $set.reason === 'string');

		const owner = this.userId;

		if (createPatient) {
			$set.patientId = await compose(db, createPatientForAppointment, this, [
				createPatient,
			]);
		} else {
			assert(typeof $set.patientId === 'string');
			const patient = await db.findOne(Patients, {
				_id: $set.patientId,
				owner,
			});
			if (patient === null) {
				throw new Meteor.Error('not-found');
			}
		}

		await availability.insertHook(db, owner, $set.begin, $set.end, 1);

		const createdAt = new Date();
		const lastModifiedAt = createdAt;

		const {insertedId: appointmentId} = await db.insertOne(Appointments, {
			...$set,
			createdAt,
			lastModifiedAt,
			owner,
		});

		return {
			_id: appointmentId,
			patientId: $set.patientId,
		};
	},
	simulate(_appointment) {
		return undefined;
	},
});
