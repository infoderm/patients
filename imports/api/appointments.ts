import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';

import addMilliseconds from 'date-fns/addMilliseconds';

import {thisYearsInterval} from '../util/datetime';

import {
	ConsultationDocument,
	Consultations,
	consultations,
	findLastConsultationInInterval,
	filterNotInRareBooks,
} from './consultations';

import invoke from './endpoint/invoke';
import insertPatient from './endpoint/patients/insert';

import unconditionallyUpdateById from './unconditionallyUpdateById';

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

const methods = {
	async 'appointments.createPatient'(fields) {
		const patient = {
			...fields,
			createdForAppointment: true,
		};
		const patientId = await invoke(insertPatient, this, [patient]);
		console.debug(`Created patient #${patientId} for new appointment.`);
		return patientId;
	},
	async 'appointments.schedule'(appointment) {
		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		const args = sanitize(appointment);

		if (args.createPatient) {
			args.consultationFields.patientId = await methods[
				'appointments.createPatient'
			].call(this, args.patientFields);
		}

		const consultationId = Appointments.insert({
			...args.consultationFields,
			createdAt: new Date(),
			owner: this.userId,
		});

		return {
			_id: consultationId,
			patientId: args.consultationFields.patientId,
		};
	},
	async 'appointments.reschedule'(appointmentId: string, appointment) {
		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		const item = Appointments.findOne({_id: appointmentId, owner: this.userId});
		if (!item) {
			throw new Meteor.Error('not-found');
		}

		const args = sanitize(appointment);

		if (args.createPatient) {
			args.consultationFields.patientId = await methods[
				'appointments.createPatient'
			].call(this, args.patientFields);
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
	'appointments.cancel': unconditionallyUpdateById<ConsultationDocument>(
		Appointments,
		(
			_existing,
			cancellationReason: string,
			cancellationExplanation: string,
		) => {
			check(cancellationReason, String);
			check(cancellationExplanation, String);
			return {
				$set: {
					isCancelled: true,
					cancellationDatetime: new Date(),
					cancellationReason,
					cancellationExplanation,
				},
			};
		},
	),
	'appointments.beginConsultation':
		unconditionallyUpdateById<ConsultationDocument>(Appointments, function () {
			const book = findLastConsultationInInterval(thisYearsInterval(), {
				...filterNotInRareBooks(),
				owner: this.userId,
			})?.book;
			const realDatetime = new Date();
			return {
				$set: {
					datetime: realDatetime,
					realDatetime,
					doneDatetime: realDatetime,
					begin: realDatetime,
					end: realDatetime,
					isDone: true,
					book,
				},
			};
		}),
	'appointments.uncancel': unconditionallyUpdateById(Appointments, {
		$set: {isCancelled: false},
	}),
	'appointments.remove': consultations.methods['consultations.remove'],
};

Meteor.methods(methods);

export const appointments = {};
