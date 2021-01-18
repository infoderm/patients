import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';

import {Consultations, consultations} from './consultations.js';
import {patients} from './patients.js';

import unconditionallyUpdateById from './unconditionallyUpdateById.js';

export const Appointments = Consultations;

if (Meteor.isServer) {
	Meteor.publish('appointments', function () {
		return Appointments.find({
			owner: this.userId,
			isDone: false
		});
	});

	Meteor.publish('patient.appointments', function (patientId, options) {
		check(patientId, String);
		return Appointments.find(
			{
				owner: this.userId,
				isDone: false,
				patientId
			},
			options
		);
	});

	Meteor.publish('patient.appointmentsAfter', function (patientId, datetime) {
		check(patientId, String);
		check(datetime, Date);
		return Appointments.find({
			owner: this.userId,
			isDone: false,
			patientId,
			datetime: {
				$gte: datetime
			}
		});
	});
}

function sanitize({datetime, duration, patient, phone, reason}) {
	check(patient.firstname, String);
	check(patient.lastname, String);
	check(patient._id, String);
	check(phone, String);
	check(datetime, Date);
	check(duration, Number);
	check(reason, String);

	return {
		createPatient: patient._id === '?',
		patientFields: {
			firstname: patient.firstname,
			lastname: patient.lastname,
			phone
		},
		consultationFields: {
			patientId: patient._id,
			datetime,
			scheduledDatetime: datetime,
			duration,
			reason,
			isDone: false
		}
	};
}

const methods = {
	'appointments.createPatient'(fields) {
		const patient = {
			...fields,
			createdForAppointment: true
		};
		const patientId = patients.insertPatient.call(this, patient);
		console.debug(`Created patient #${patientId} for new appointment.`);
		return patientId;
	},
	'appointments.schedule'(appointment) {
		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		const args = sanitize(appointment);

		if (args.createPatient) {
			args.consultationFields.patientId = methods[
				'appointments.createPatient'
			].call(this, args.patientFields);
		}

		const consultationId = Appointments.insert({
			...args.consultationFields,
			createdAt: new Date(),
			owner: this.userId
		});

		return {
			_id: consultationId,
			patientId: args.consultationFields.patientId
		};
	},
	'appointments.reschedule'(appointmentId, appointment) {
		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		const item = Appointments.findOne({_id: appointmentId, owner: this.userId});
		if (!item) {
			throw new Meteor.Error('not-found');
		}

		const args = sanitize(appointment);

		if (args.createPatient) {
			args.consultationFields.patientId = methods[
				'appointments.createPatient'
			].call(this, args.patientFields);
		}

		const fields = {
			...args.consultationFields
		};

		Appointments.update(appointmentId, {$set: fields});

		return {
			_id: appointmentId,
			patientId: args.consultationFields.patientId
		};
	},
	'appointments.cancel': unconditionallyUpdateById(
		Appointments,
		(_existing, reason) => {
			check(reason, String);
			return {
				$set: {
					isCancelled: true,
					cancellationDatetime: new Date(),
					cancellationReason: reason
				}
			};
		}
	),
	'appointments.beginConsultation': unconditionallyUpdateById(
		Appointments,
		() => {
			const realDatetime = new Date();
			return {
				$set: {
					datetime: realDatetime,
					realDatetime,
					price: 0,
					paid: 0,
					isDone: true
				}
			};
		}
	),
	'appointments.uncancel': unconditionallyUpdateById(Appointments, {
		$set: {isCancelled: false}
	}),
	'appointments.remove': consultations.methods['consultations.remove']
};

Meteor.methods(methods);

export const appointments = {};
