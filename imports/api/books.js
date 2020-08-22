import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';

import dateParseISO from 'date-fns/parseISO';
import addYears from 'date-fns/addYears';

const collection = 'books';
const publication = 'books';
const stats = 'books.stats';

export const Books = new Mongo.Collection(collection);
const Stats = new Mongo.Collection(stats);

if (Meteor.isServer) {
	Meteor.publish(publication, function (args) {
		const query = {
			...args,
			owner: this.userId
		};
		return Books.find(query);
	});
}

export const books = {
	options: {
		collection,
		publication,
		stats,
		parentPublication: 'book.consultations',
		parentPublicationStats: 'book.stats'
	},
	cache: {Stats},
	add: (owner, name) => {
		check(owner, String);
		check(name, String);

		name = name.trim();

		const [fiscalYear, bookNumber] = books.parse(name);

		const key = {
			owner,
			name
		};

		const fields = {
			owner,
			name,
			fiscalYear,
			bookNumber
		};

		return Books.upsert(key, {$set: fields});
	},

	remove: (owner, name) => {
		check(owner, String);
		check(name, String);

		name = name.trim();

		const fields = {
			owner,
			name
		};

		return Books.remove(fields);
	},

	format: (year, book) => `${year}/${book}`,

	name: (datetime, book) => books.format(datetime.getFullYear(), book),

	split: (name) => {
		const pivot = name.indexOf('/');
		return [name.slice(0, pivot), name.slice(pivot + 1)];
	},

	parse: (name) => {
		const [year, book] = books.split(name);

		let fiscalYear = year;
		let bookNumber = book;

		try {
			fiscalYear = Number.parseInt(fiscalYear, 10);
		} catch {}

		try {
			bookNumber = Number.parseInt(bookNumber, 10);
		} catch {}

		return [fiscalYear, bookNumber];
	},

	range: (name) => {
		const [year, book] = books.split(name);

		const begin = dateParseISO(`${year}-01-01`);
		const end = addYears(begin, 1);

		return [book, begin, end];
	},

	selector: (name) => {
		const [book, begin, end] = books.range(name);

		return {
			book,
			datetime: {
				$gte: begin,
				$lt: end
			}
		};
	},

	MAX_CONSULTATIONS: 50,
	DOWNLOAD_FIRST_BOOK: 1,
	DOWNLOAD_LAST_BOOK: 99,
	DOWNLOAD_MAX_ROWS: 60
};
