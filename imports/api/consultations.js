import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import isAfter from 'date-fns/isAfter' ;
import isBefore from 'date-fns/isBefore' ;

import { list , map , range , product } from '@aureooms/js-itertools' ;

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

	Meteor.publish('patient.consultations', function (patientId, options) {
		check(patientId, String);
		return Consultations.find({
			owner: this.userId ,
			isDone: true,
			patientId ,
		}, options);
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

	Meteor.publish('book.consultations', function ( name , options = {} ) {
		const query = {
			owner: this.userId ,
			isDone: true,
			...books.selector(name) ,
		} ;
		if (options.fields) {
			const { fields , ...rest } = options ;
			const _options = {
				...rest,
				fields: {
					...fields,
				}
			};
			for ( const key of Object.keys(query) ) _options.fields[key] = 1;
			return Consultations.find(query, _options);
		}
		else return Consultations.find(query, options);
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

	'books.interval.csv'(begin, end, firstBook, lastBook, maxRows) {

		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		check(begin, Date);
		check(end, Date);
		check(firstBook, Number);
		check(lastBook, Number);
		check(maxRows, Number);

		const beginBook = firstBook;
		const endBook = lastBook + 1;

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

		let minDatetime = end;
		let maxDatetime = begin;

		for ( const consultation of consultations ) {
			const { datetime , book , price } = consultation ;

			if (isBefore(datetime, minDatetime)) minDatetime = datetime;
			if (isAfter(datetime, maxDatetime)) maxDatetime = datetime;

			const bookSlug = books.name(datetime, book) ;

			if ( data[bookSlug] === undefined ) data[bookSlug] = [] ;

			data[bookSlug].push(price);
		}

		const beginYear = minDatetime.getFullYear();
		const endYear = maxDatetime.getFullYear() + 1;

		const header = list(map(([year, book]) => books.format(year, book), product([range(beginYear, endYear), range(beginBook, endBook)]))) ;
		const lines = [] ;

		for ( const i of range(maxRows) ) {
			const line = [];
			for ( const bookSlug of header ) {
				if ( data[bookSlug] !== undefined  && data[bookSlug][i] !== undefined ) {
					line.push(data[bookSlug][i]);
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
