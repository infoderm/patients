import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { Consultations } from './consultations.js' ;
import { Patients } from './patients.js' ;

export const Appointments = Consultations ;

if (Meteor.isServer) {

	Meteor.publish('appointments', function () {
		return Consultations.find({
			owner: this.userId ,
			isDone: false,
		});
	});

	Meteor.publish('patient.appointments', function (patientId, options) {
		check(patientId, String);
		return Consultations.find({
			owner: this.userId ,
			isDone: false,
			patientId ,
		}, options);
	});

	Meteor.publish('patient.appointmentsAfter', function (patientId, datetime) {
		check(patientId, String);
		check(datetime, Date);
		return Consultations.find({
			owner: this.userId ,
			isDone: false,
			patientId ,
			datetime : {
				$gte : datetime ,
			} ,
		});
	});

}

function sanitize ( {
	datetime,
	duration,
	patient,
	phone,
	reason,
} ) {

	check(patient.firstname, String);
	check(patient.lastname, String);
	check(patient._id, String);
	check(phone, String);
	check(datetime, Date);
	check(duration, Number);
	check(reason, String);

	return {
		createPatient: patient._id === '?' ,
		patientFields : {
			firstname: patient.firstname ,
			lastname: patient.lastname ,
			phone ,
		} ,
		consultationFields : {
			patientId: patient._id ,
			datetime ,
			duration ,
			reason ,
			isDone: false,
		} ,
	}

}

Meteor.methods({

	'consultations.schedule' ( appointment ) {

		if (!this.userId) throw new Meteor.Error('not-authorized');

		const args = sanitize(appointment);

		if ( args.createPatient ) {
			const patientId = Patients.insert({
				...args.patientFields,
				createdForAppointment: true,
				createdAt: new Date(),
				owner: this.userId,
			});
			console.debug(`Created patient #${patientId} for new appointment.`) ;
			args.consultationFields.patientId = patientId ;
		}

		return Consultations.insert({
			...args.consultationFields,
			createdAt: new Date(),
			owner:this.userId,
		});

	} ,

});

export const appointments = {} ;
