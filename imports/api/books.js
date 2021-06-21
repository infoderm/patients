import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';

import dateParseISO from 'date-fns/parseISO';
import addYears from 'date-fns/addYears';

import makeQuery from './makeQuery';
import makeObservedQueryHook from './makeObservedQueryHook';
import makeObservedQueryPublication from './makeObservedQueryPublication';
import {normalized, normalizeInput, parseUint32StrictOrString} from './string';

import {
	STATS_SUFFIX,
	FIND_CACHE_SUFFIX,
	FIND_OBSERVE_SUFFIX
} from './createTagCollection';

const collection = 'books';
const publication = 'books';
const stats = collection + STATS_SUFFIX;
const cacheCollection = collection + FIND_CACHE_SUFFIX;
const cachePublication = collection + FIND_OBSERVE_SUFFIX;

export const Books = new Mongo.Collection(collection);
const Stats = new Mongo.Collection(stats);
const BooksCache = new Mongo.Collection(cacheCollection);

export const useBooks = makeQuery(Books, publication);

// TODO rename to useObservedBooks
export const useBooksFind = makeObservedQueryHook(BooksCache, cachePublication);

if (Meteor.isServer) {
	Meteor.publish(publication, function (args) {
		const query = {
			...args,
			owner: this.userId
		};
		return Books.find(query);
	});

	Meteor.publish(
		cachePublication,
		makeObservedQueryPublication(Books, cacheCollection)
	);
}

const sanitizeInput = normalizeInput;
const sanitize = normalized;

export const books = {
	options: {
		collection,
		publication,
		stats,
		parentPublication: 'book.consultations',
		parentPublicationStats: 'book.stats'
	},
	cache: {Stats},
	sanitizeInput,
	sanitize,
	add: (owner, name, verbatim = false) => {
		check(owner, String);
		check(name, String);

		name = verbatim ? name : sanitize(name);

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

		name = sanitize(name);

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

		const fiscalYear = parseUint32StrictOrString(year);
		const bookNumber = parseUint32StrictOrString(book);

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

	isReal: (name) => {
		const [fiscalYear, bookNumber] = books.parse(name);
		if (typeof fiscalYear !== 'number') return false;
		if (typeof bookNumber !== 'number') return false;
		return Number.isInteger(bookNumber) && bookNumber > 0;
	},

	MAX_CONSULTATIONS: 50,
	DOWNLOAD_FIRST_BOOK: 1,
	DOWNLOAD_LAST_BOOK: 99,
	DOWNLOAD_MAX_ROWS: 60,
	RARE: ['0']
};
