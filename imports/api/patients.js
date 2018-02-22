import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Patients = new Mongo.Collection('patients');

if (Meteor.isServer) {
	Meteor.publish('patients', function () {
		return Patients.find({ owner: this.userId });
	});
	Meteor.publish('patient', function (_id) {
		check(_id, String);
		return Patients.find({ owner: this.userId , _id });
	});
}

function sanitize ( {
	niss,
	firstname,
	lastname,
	birthdate,
	sex,
	photo,
	about,
} ) {

	about = about || '' ;

	check(niss, String);
	check(firstname, String);
	check(lastname, String);
	check(birthdate, String);
	check(sex, String);
	check(photo, String);
	check(about, String);

	niss = niss.trim();
	firstname = firstname.trim();
	lastname = lastname.trim();
	birthdate = birthdate.trim();
	sex = sex.trim();
	photo = photo.replace(/\n/g,'');
	about = about.trim();

	return {
		niss,
		firstname,
		lastname,
		birthdate,
		sex,
		photo,
		about,
	} ;

}

Meteor.methods({
	'patients.insert'( patient ) {

		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		return Patients.insert({
			...sanitize(patient),
			createdAt: new Date(),
			owner: this.userId,
			username: Meteor.users.findOne(this.userId).username,
		});

	},

	'patients.update'(patientId, fields) {
		check(patientId, String);
		const patient = Patients.findOne(patientId);
		if (patient.owner !== this.userId) {
			throw new Meteor.Error('not-authorized');
		}
		return Patients.update(patientId, { $set: sanitize(fields) });
	},

	'patients.remove'(patientId){
		check(patientId, String);
		const patient = Patients.findOne(patientId);
		if (patient.owner !== this.userId) {
			throw new Meteor.Error('not-authorized');
		}
		return Patients.remove(patientId);
	},

});
