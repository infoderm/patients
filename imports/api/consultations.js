import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { list , map , range } from '@aureooms/js-itertools' ;

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

	Meteor.publish('consultations', function (args = {}) {
		return Consultations.find({
			owner: this.userId ,
			isDone: true,
			...args,
		});
	});

	Meteor.publish('consultations.interval', function (from, to) {
		return Consultations.find({
			owner: this.userId ,
			datetime : {
				$gte : from ,
				$lt : to,
			},
		});
	});

	Meteor.publish('consultations.accounted.interval.last', function (from, to) {
		return Consultations.find({
			owner: this.userId ,
			isDone: true,
			datetime : {
				$gte : from ,
				$lt : to,
			},
			book : {
				$ne : '0' ,
			} ,
		}, {
			sort: {
				datetime: -1 ,
				limit: 1 ,
			}
		});
	});

	Meteor.publish('consultations.last', function () {
		return Consultations.find({
			owner: this.userId ,
			isDone: true,
		}, {
			sort: {
				datetime: -1 ,
				limit: 1 ,
			}
		});
	});

	Meteor.publish('consultations.wired', function () {
		return Consultations.find({
			owner: this.userId ,
			isDone: true,
			payment_method: 'wire',
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

	Meteor.publish('consultations.missing-a-price', function () {
		return Consultations.find({
			owner: this.userId ,
			isDone: true,
			$expr: {
				$or: [
					{ price : { $not: { $type: 1 } } } ,
					{ price : NaN } ,
				] ,
			},
		});
	});

	Meteor.publish('consultations.missing-a-book', function () {
		return Consultations.find({
			owner: this.userId ,
			isDone: true,
			$expr: {
				$or: [
					{ book : null } ,
					{ book : '' } ,
				] ,
			},
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
	payment_method,
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
	payment_method === undefined || check(payment_method, String);

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
		payment_method,
		isDone: true,
	} ;

}

Meteor.methods({

	'books.year.csv'(year) {

		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		check(year, Number);

		const begin = new Date(`${year}-01-01`);
		const end = new Date(`${year+1}-01-01`);

		const consultations = Consultations.find({
			datetime: {
				$gte : begin ,
				$lt : end ,
			},
			owner: this.userId,
		}, {
			sort: {
				datetime: 1 ,
			} ,
		}).fetch();

		const data = {} ;

		for ( const consultation of consultations ) {
			const { book , price } = consultation ;

			if ( data[book] === undefined ) data[book] = [] ;

			data[book].push(price);
		}

		const header = list(map(i => ''+i, range(1, 100))) ;
		const MAX = 60;
		const lines = [] ;

		for ( const i of range(MAX) ) {
			const line = [];
			for ( const book of header ) {
				if ( data[book] !== undefined  && data[book][i] !== undefined ) {
					line.push(data[book][i]);
				}
				else {
					line.push('');
				}
			}
			lines.push(line);
		}

		const table = [ ] ;
		table.push(header.join(','));
		for ( const line of lines ) {
			table.push(line.join(','));
		}

		return table.join('\n');

	} ,

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
