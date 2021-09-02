import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';

import addMilliseconds from 'date-fns/addMilliseconds';

import {Consultations} from './consultations';

export const Appointments = Consultations;

if (Meteor.isServer) {
	Meteor.publish('appointments', function () {
		return Appointments.find({
			owner: this.userId,
			isDone: false,
		});
	});

	Meteor.publish('patient.appointments', function (patientId, options) {
		check(patientId, String);
		return Appointments.find(
			{
				owner: this.userId,
				isDone: false,
				patientId,
			},
			options,
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
				$gte: datetime,
			},
		});
	});
}

function sanitize({datetime, duration, patient, phone, reason}) {
	check(patient.firstname, String);
	check(patient.lastname, String);
	check(patient._id, String);
	if (phone !== undefined) check(phone, String);
	check(datetime, Date);
	check(duration, Number);
	check(reason, String);

	return {
		createPatient: patient._id === '?',
		patientFields: {
			firstname: patient.firstname,
			lastname: patient.lastname,
			phone,
		},
		consultationFields: {
			patientId: patient._id,
			datetime,
			scheduledDatetime: datetime,
			duration,
			begin: datetime,
			end: addMilliseconds(datetime, duration),
			reason,
			isDone: false,
		},
	};
}

export const appointments = {
	sanitize,
};
