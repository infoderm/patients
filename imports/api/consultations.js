import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Consultations = new Mongo.Collection('consultations');

if (Meteor.isServer) {
	Meteor.publish('consultations', function () {
		return Consultations.find({ owner: this.userId });
	});
	Meteor.publish('consultation', function (_id) {
		check(_id, String);
		return Consultations.find({ owner: this.userId , _id });
	});
	Meteor.publish('patient.consultations', function (patientId) {
		check(patientId, String);
		return Consultations.find({ owner: this.userId , patientId: patientId });
	});
}

function sanitize ( {
	patientId,
	datetime,
	reason,
	done,
	todo,
	treatment,
	next,
	more,

	currency,
	price,
	paid,
	book,
} ) {

	check(patientId, String);
	check(datetime, Date);

	check(reason, String);
	check(done, String);
	check(todo, String);
	check(treatment, String);
	check(next, String);
	more === undefined || check(more, String);

	currency === undefined || check(currency, String);
	price === undefined || check(price, Number);
	paid === undefined || check(paid, Number);
	book === undefined || check(book, String);

	reason = reason.trim();
	done = done.trim();
	todo = todo.trim();
	treatment = treatment.trim();
	next = next.trim();
	more = more && more.trim();

	currency = currency && currency.trim().toUpperCase()
	book = book && book.trim();

	return {
		patientId,
		datetime,
		reason,
		done,
		todo,
		treatment,
		next,
		more,

		currency,
		price,
		paid,
		book,
	} ;

}

Meteor.methods({

	'consultations.insert'(consultation) {

		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		return Consultations.insert({
			...sanitize(consultation),
			createdAt: new Date(),
			owner: this.userId,
			username: Meteor.users.findOne(this.userId).username,
		});

	},

	'consultations.update'(consultationId, fields) {
		check(consultationId, String);
		const consultation = Consultations.findOne(consultationId);
		if (consultation.owner !== this.userId) {
			throw new Meteor.Error('not-authorized');
		}
		return Consultations.update(consultationId, { $set: sanitize(fields) });
	},

	'consultations.remove'(consultationId){
		check(consultationId, String);
		const consultation = Consultations.findOne(consultationId);
		if (consultation.owner !== this.userId) {
			throw new Meteor.Error('not-authorized');
		}
		return Consultations.remove(consultationId);
	},

});
