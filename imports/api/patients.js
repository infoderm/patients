import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Patients = new Mongo.Collection('patients');

if (Meteor.isServer) {
	Meteor.publish('patients', function patientsPublication() {
		return Patients.find({ owner: this.userId });
	});
}

Meteor.methods({
	'patients.insert'({
		niss,
		firstname,
		lastname,
		birthdate,
		sex,
		photo,
	}) {

		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		niss = niss.trim();
		firstname = firstname.trim();
		lastname = lastname.trim();
		birthdate = birthdate.trim();
		sex = sex.trim();
		photo = photo.replace(/\n/g,'');

		check(niss, String);
		check(firstname, String);
		check(lastname, String);
		check(birthdate, String);
		check(sex, String);
		check(photo, String);

		Patients.insert({
			niss,
			firstname,
			lastname,
			birthdate,
			sex,
			photo,
			createdAt: new Date(),
			owner: this.userId,
			username: Meteor.users.findOne(this.userId).username,
		});

	},

	'patients.remove'(patientId){
		check(patientId, String);
		const patient = Patients.findOne(patientId);
		if (patient.owner !== this.userId) {
			throw new Meteor.Error('not-authorized');
		}
		Patients.remove(patientId);
	},

})
