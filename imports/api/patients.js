import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { Consultations } from './consultations.js';
import { Uploads } from './uploads.js';

import { insurances } from './insurances.js';
import { doctors } from './doctors.js';

export const Patients = new Mongo.Collection('patients');

if (Meteor.isServer) {

	Meteor.publish('patients', function () {
		return Patients.find({ owner: this.userId });
	});

	Meteor.publish('patient', function (_id) {
		check(_id, String);
		return Patients.find({ owner: this.userId , _id });
	});

	Meteor.publish('patients-of-doctor', function (doctor) {
		check(doctor, String);
		return Patients.find({ owner: this.userId , doctor });
	});

	Meteor.publish('patients-of-insurance', function (insurance) {
		check(insurance, String);
		return Patients.find({ owner: this.userId , insurance });
	});

}

function sanitize ( {

	niss,
	firstname,
	lastname,
	birthdate,
	sex,
	photo,

	antecedents,
	allergies,
	ongoing,
	about,

	municipality,
	streetandnumber,
	zip,

	phone,
	doctor,
	insurance,

	noshow,

} ) {

	check(niss, String);
	check(firstname, String);
	check(lastname, String);
	check(birthdate, String);
	check(sex, String);
	check(photo, String);

	antecedents === undefined || check(antecedents, String);
	allergies === undefined || check(allergies, String);
	ongoing === undefined || check(ongoing, String);
	about === undefined || check(about, String);

	municipality === undefined || check(municipality, String);
	streetandnumber === undefined || check(streetandnumber, String);
	zip === undefined || check(zip, String);

	phone === undefined || check(phone, String);
	doctor === undefined || check(doctor, String);
	insurance === undefined || check(insurance, String);

	noshow === undefined || check(noshow, Number);

	niss = niss.trim();
	firstname = firstname.trim();
	lastname = lastname.trim();
	birthdate = birthdate.trim();
	sex = sex.trim();
	photo = photo.replace(/\n/g,'');

	antecedents = antecedents && antecedents.trim();
	allergies = allergies && allergies.trim();
	ongoing = ongoing && ongoing.trim();
	about = about && about.trim();

	municipality = municipality && municipality.trim();
	streetandnumber = streetandnumber && streetandnumber.trim();
	zip = zip && zip.trim();

	phone = phone && phone.trim();
	doctor = doctor && doctor.trim();
	insurance = insurance && insurance.trim();

	return {
		niss,
		firstname,
		lastname,
		birthdate,
		sex,
		photo,

		antecedents,
		allergies,
		ongoing,
		about,

		municipality,
		streetandnumber,
		zip,

		phone,
		doctor,
		insurance,

		noshow,

	} ;

}

Meteor.methods({
	'patients.insert'( patient ) {

		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		const fields = sanitize(patient);

		if ( fields.insurance ) insurances.add(this.userId, fields.insurance) ;
		if ( fields.doctor ) doctors.add(this.userId, fields.doctor) ;

		return Patients.insert({
			...fields,
			createdAt: new Date(),
			owner: this.userId,
			username: Meteor.users.findOne(this.userId).username,
		});

	},

	'patients.update'(patientId, newfields) {
		check(patientId, String);
		const patient = Patients.findOne(patientId);
		if (patient.owner !== this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		const fields = sanitize(newfields);

		if ( fields.insurance ) insurances.add(this.userId, fields.insurance) ;
		if ( fields.doctor ) doctors.add(this.userId, fields.doctor) ;

		return Patients.update(patientId, { $set: fields });
	},

	'patients.attach'(patientId, uploadId) {
		check(patientId, String);
		check(uploadId, String);
		const patient = Patients.findOne(patientId);
		const upload = Uploads.findOne(uploadId);
		if (!patient || patient.owner !== this.userId) {
			throw new Meteor.Error('not-authorized', 'user does not own patient');
		}
		if (!upload || upload.userId !== this.userId) {
			throw new Meteor.Error('not-authorized', 'user does not own attachment');
		}
		return Patients.update(patientId, { $addToSet: { attachments: uploadId } });
	},

	'patients.detach'(patientId, uploadId) {
		check(patientId, String);
		check(uploadId, String);
		const patient = Patients.findOne(patientId);
		const upload = Uploads.findOne(uploadId);
		if (!patient || patient.owner !== this.userId) {
			throw new Meteor.Error('not-authorized', 'user does not own patient');
		}
		if (!upload || upload.userId !== this.userId) {
			throw new Meteor.Error('not-authorized', 'user does not own attachment');
		}
		return Patients.update(patientId, { $pull: { attachments: uploadId } });
	},

	'patients.remove'(patientId){
		check(patientId, String);
		const patient = Patients.findOne(patientId);
		if (patient.owner !== this.userId) {
			throw new Meteor.Error('not-authorized');
		}
		Consultations.remove({ owner: this.userId , patientId: patientId }) ;
		return Patients.remove(patientId);
	},

});
