import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { list } from '@aureooms/js-itertools' ;
import { map } from '@aureooms/js-itertools' ;

import { Consultations } from './consultations.js';
import { Uploads } from './uploads.js';

import { insurances } from './insurances.js';
import { doctors } from './doctors.js';
import { allergies } from './allergies.js';

export const Patients = new Mongo.Collection('patients');

insurances.init( Patients ) ;
doctors.init( Patients ) ;
allergies.init( Patients ) ;

if (Meteor.isServer) {

	Meteor.publish('patients', function () {
		return Patients.find({ owner: this.userId });
	});

	Meteor.publish('patient', function (_id) {
		check(_id, String);
		return Patients.find({ owner: this.userId , _id });
	});

}

function updateTags ( userId , fields ) {
	for ( const [ tagCollection , tagList ] of [
		[ insurances , fields.insurances ] ,
		[ doctors , fields.doctors ] ,
		[ allergies , fields.allergies ] ,
	] ) {
		if ( tagList ) {
			for ( const tag of tagList ) {
				tagCollection.add(userId, tag) ;
			}
		}
	}
}

function sanitize ( {

	niss,
	firstname,
	lastname,
	birthdate,
	sex,
	photo,

	antecedents,
	ongoing,
	about,

	municipality,
	streetandnumber,
	zip,
	phone,

	insurances,
	doctors,
	allergies,

	noshow,

} ) {

	check(niss, String);
	check(firstname, String);
	check(lastname, String);
	check(birthdate, String);
	check(sex, String);
	photo === undefined || check(photo, String);

	antecedents === undefined || check(antecedents, String);
	ongoing === undefined || check(ongoing, String);
	about === undefined || check(about, String);

	municipality === undefined || check(municipality, String);
	streetandnumber === undefined || check(streetandnumber, String);
	zip === undefined || check(zip, String);
	phone === undefined || check(phone, String);

	insurances === undefined || check(insurances, [String]);
	doctors === undefined || check(doctors, [String]);
	allergies === undefined || check(allergies, [String]);

	noshow === undefined || check(noshow, Number);

	niss = niss.trim();
	firstname = firstname.trim();
	lastname = lastname.trim();
	birthdate = birthdate.trim();
	sex = sex.trim();
	photo = photo ? photo.replace(/\n/g,'') : photo;

	antecedents = antecedents && antecedents.trim();
	ongoing = ongoing && ongoing.trim();
	about = about && about.trim();

	municipality = municipality && municipality.trim();
	streetandnumber = streetandnumber && streetandnumber.trim();
	zip = zip && zip.trim();
	phone = phone && phone.trim();

	if ( insurances ) insurances = list(map(x=>x.trim(), insurances)) ;
	if ( doctors ) doctors = list(map(x=>x.trim(), doctors)) ;
	if ( allergies ) allergies = list(map(x=>x.trim(), allergies)) ;

	return {
		niss,
		firstname,
		lastname,
		birthdate,
		sex,
		photo,

		antecedents,
		ongoing,
		about,

		municipality,
		streetandnumber,
		zip,
		phone,

		allergies,
		doctors,
		insurances,

		noshow,

	} ;

}

Meteor.methods({
	'patients.insert'( patient ) {

		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		const fields = sanitize(patient);

		updateTags(this.userId, fields);

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

		updateTags(this.userId, fields);

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
