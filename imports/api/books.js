import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';

import dateParseISO from 'date-fns/parseISO';
import addYears from 'date-fns/addYears';

import makeQuery from './makeQuery.js';
import makeObservedQuery from './makeObservedQuery.js';
import observeQuery from './observeQuery.js';
import {parseUint32StrictOrString} from './string.js';

import {
	STATS_SUFFIX,
	FIND_CACHE_SUFFIX,
	FIND_OBSERVE_SUFFIX
} from './createTagCollection.js';

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
export const useBooksFind = makeObservedQuery(BooksCache, cachePublication);

if (Meteor.isServer) {
	Meteor.publish(publication, function (args) {
		const query = {
			...args,
			owner: this.userId
		};
		return Books.find(query);
	});

	Meteor.publish(cachePublication, observeQuery(Books, cacheCollection));
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

	MAX_CONSULTATIONS: 50,
	DOWNLOAD_FIRST_BOOK: 1,
	DOWNLOAD_LAST_BOOK: 99,
	DOWNLOAD_MAX_ROWS: 60
};
