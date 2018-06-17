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
