import dateParseISO from 'date-fns/parseISO';
import addYears from 'date-fns/addYears';

import schema from '../lib/schema';

import makeQuery from './makeQuery';
import makeObservedQueryHook from './makeObservedQueryHook';
import {
	type NormalizedLine,
	normalizedLine,
	normalizedLineInput,
	parseUint32StrictOrString,
} from './string';

import {Books, collection} from './collection/books';
import {BooksCache} from './collection/books/cache';

import publication from './publication/books/find';
import cachePublication from './publication/books/observe';
import type TransactionDriver from './transaction/TransactionDriver';

export const useBooks = makeQuery(Books, publication);

// TODO rename to useObservedBooks
export const useBooksFind = makeObservedQueryHook(BooksCache, cachePublication);

const sanitizeInput = normalizedLineInput;
const sanitize = normalizedLine;

export const books = {
	options: {
		collection,
		parentPublication: 'book.consultations',
	},
	sanitizeInput,
	sanitize,
	async add(
		db: TransactionDriver,
		owner: string,
		name: string,
		verbatim = false,
	) {
		schema.string().parse(owner);
		schema.string().parse(name);

		const normalizedName = verbatim ? (name as NormalizedLine) : sanitize(name);

		const [fiscalYear, bookNumber] = books.parse(normalizedName);

		const key = {
			owner,
			name: normalizedName,
		};

		const fields = {
			owner,
			name: normalizedName,
			fiscalYear,
			bookNumber,
		};

		return db.updateOne(Books, key, {$set: fields}, {upsert: true});
	},

	async remove(db: TransactionDriver, owner: string, name: string) {
		schema.string().parse(owner);
		schema.string().parse(name);

		const normalizedName = sanitize(name);

		const fields = {
			owner,
			name: normalizedName,
		};

		return db.deleteOne(Books, fields);
	},

	format: (year, book) => `${year}/${book}`,

	name: (datetime: Date, book) => books.format(datetime.getFullYear(), book),

	split(name: string): [string, string] {
		const pivot = name.indexOf('/');
		return [name.slice(0, pivot), name.slice(pivot + 1)];
	},

	parse(name: string) {
		const [year, book] = books.split(name);

		const fiscalYear = parseUint32StrictOrString(year);
		const bookNumber = parseUint32StrictOrString(book);

		return [fiscalYear, bookNumber];
	},

	range(name: string): [string, Date, Date] {
		const [year, book] = books.split(name);

		const begin = dateParseISO(`${year}-01-01`);
		const end = addYears(begin, 1);

		return [book, begin, end];
	},

	filter(name: string) {
		const [book, begin, end] = books.range(name);

		return {
			book,
			datetime: {
				$gte: begin,
				$lt: end,
			},
		};
	},

	isReal(name: string) {
		const [fiscalYear, bookNumber] = books.parse(name);
		if (typeof fiscalYear !== 'number') return false;
		if (typeof bookNumber !== 'number') return false;
		return Number.isInteger(bookNumber) && bookNumber > 0;
	},

	isRealBookNumberStringRegex: /^[1-9]\d*$/,
	isValidInBookNumberStringRegex: /^[1-9]\d*$/,

	MAX_CONSULTATIONS: 50,
	DOWNLOAD_FIRST_BOOK: 1,
	DOWNLOAD_LAST_BOOK: 99,
	DOWNLOAD_MAX_ROWS: 60,
};
