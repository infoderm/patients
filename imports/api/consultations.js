import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { Uploads } from './uploads.js';
import { books } from './books.js';

export const Consultations = new Mongo.Collection('consultations');

if (Meteor.isServer) {

	Meteor.publish('consultation', function (_id) {
		check(_id, String);
		return Consultations.find({
			owner: this.userId ,
			_id ,
		});
	});

	Meteor.publish('consultations', function () {
		return Consultations.find({
			owner: this.userId ,
			isDone: true,
		});
	});

	Meteor.publish('consultationsAndAppointments', function () {
		return Consultations.find({
			owner: this.userId ,
		});
	});

	Meteor.publish('patient.consultations', function (patientId) {
		check(patientId, String);
		return Consultations.find({
			owner: this.userId ,
			isDone: true,
			patientId ,
		});
	});

	Meteor.publish('consultations.unpaid', function () {
		return Consultations.find({
			owner: this.userId ,
			isDone: true,
			$expr: {
				$ne: [ "$paid", "$price" ] ,
			} ,
		});
	});

	Meteor.publish('book.consultations', function ( name ) {
		return Consultations.find({
			owner: this.userId ,
			isDone: true,
			...books.selector(name) ,
		});
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
		isDone: true,
	} ;

}

Meteor.methods({

	'consultations.insert'(consultation) {

		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		const fields = sanitize(consultation);

		if ( fields.datetime && fields.book ) books.add(this.userId, books.name(fields.datetime, fields.book)) ;

		return Consultations.insert({
			...fields,
			createdAt: new Date(),
			owner: this.userId,
		});

	},

	'consultations.update'(consultationId, newfields) {
		check(consultationId, String);
		const consultation = Consultations.findOne(consultationId);
		if (!consultation || consultation.owner !== this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		const fields = sanitize(newfields);
		if ( fields.datetime && fields.book ) books.add(this.userId, books.name(fields.datetime, fields.book)) ;

		return Consultations.update(consultationId, { $set: fields });
	},

	'consultations.attach'(consultationId, uploadId) {
		check(consultationId, String);
		check(uploadId, String);
		const consultation = Consultations.findOne(consultationId);
		const upload = Uploads.findOne(uploadId);
		if (!consultation || consultation.owner !== this.userId) {
			throw new Meteor.Error('not-authorized', 'user does not own consultation');
		}
		if (!upload || upload.userId !== this.userId) {
			throw new Meteor.Error('not-authorized', 'user does not own attachment');
		}
		return Consultations.update(consultationId, { $addToSet: { attachments: uploadId } });
	},

	'consultations.detach'(consultationId, uploadId) {
		check(consultationId, String);
		check(uploadId, String);
		const consultation = Consultations.findOne(consultationId);
		const upload = Uploads.findOne(uploadId);
		if (!consultation || consultation.owner !== this.userId) {
			throw new Meteor.Error('not-authorized', 'user does not own consultation');
		}
		if (!upload || upload.userId !== this.userId) {
			throw new Meteor.Error('not-authorized', 'user does not own attachment');
		}
		return Consultations.update(consultationId, { $pull: { attachments: uploadId } });
	},

	'consultations.remove'(consultationId){
		check(consultationId, String);
		const consultation = Consultations.findOne(consultationId);
		if (!consultation || consultation.owner !== this.userId) {
			throw new Meteor.Error('not-authorized');
		}
		return Consultations.remove(consultationId);
	},

});
