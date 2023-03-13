import {check} from 'meteor/check';

import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';
import {product} from '@set-theory/cartesian-product';
import {map} from '@iterable-iterator/map';
import {list} from '@iterable-iterator/list';
import {range} from '@iterable-iterator/range';

import {Consultations} from '../../collection/consultations';
import {books} from '../../books';

import define from '../define';
import {AuthenticationLoggedIn} from '../../Authentication';

export default define({
	name: 'books.interval.csv',
	authentication: AuthenticationLoggedIn,
	validate(
		begin: Date,
		end: Date,
		firstBook: number,
		lastBook: number,
		maxRows: number,
	) {
		check(begin, Date);
		check(end, Date);
		check(firstBook, Number);
		check(lastBook, Number);
		check(maxRows, Number);
	},
	async run(
		begin: Date,
		end: Date,
		firstBook: number,
		lastBook: number,
		maxRows: number,
	) {
		const beginBook = firstBook;
		const endBook = lastBook + 1;

		const consultations = await Consultations.find(
			{
				isDone: true,
				datetime: {
					$gte: begin,
					$lt: end,
				},
				owner: this.userId,
			},
			{
				sort: {
					datetime: 1,
				},
			},
		).fetchAsync();

		const data = {};

		let minDatetime = end;
		let maxDatetime = begin;

		for (const consultation of consultations) {
			const {datetime, book, price} = consultation;

			if (isBefore(datetime, minDatetime)) {
				minDatetime = datetime;
			}

			if (isAfter(datetime, maxDatetime)) {
				maxDatetime = datetime;
			}

			const bookSlug = books.name(datetime, book);

			if (data[bookSlug] === undefined) {
				data[bookSlug] = [];
			}

			data[bookSlug].push(price);
		}

		const beginYear = minDatetime.getFullYear();
		const endYear = maxDatetime.getFullYear() + 1;

		const header = list(
			map(
				([year, book]) => books.format(year, book),
				product([range(beginYear, endYear), range(beginBook, endBook)]),
			),
		);
		const lines: string[][] = [];

		for (const i of range(maxRows)) {
			const line: string[] = [];
			for (const bookSlug of header) {
				if (data[bookSlug]?.[i] !== undefined) {
					line.push(data[bookSlug][i]);
				} else {
					line.push('');
				}
			}

			lines.push(line);
		}

		const table: string[] = [];
		table.push(header.join(','));
		for (const line of lines) {
			table.push(line.join(','));
		}

		return table.join('\n');
	},
});
