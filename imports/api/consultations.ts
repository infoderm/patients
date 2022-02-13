import {check} from 'meteor/check';

import {PairingHeap} from '@heap-data-structure/pairing-heap';
import {increasing, decreasing} from '@total-order/date';

import differenceInMilliseconds from 'date-fns/differenceInMilliseconds';

import {books} from './books';

import {ConsultationDocument, Consultations} from './collection/consultations';
import {key as statsKey} from './collection/consultations/stats';
import TransactionDriver from './transaction/TransactionDriver';
import Filter from './transaction/Filter';

export const DEFAULT_DURATION_IN_MINUTES = 15;
export const DEFAULT_DURATION_IN_SECONDS = DEFAULT_DURATION_IN_MINUTES * 60;
export const DEFAULT_DURATION_IN_MILLISECONDS =
	DEFAULT_DURATION_IN_SECONDS * 1000;

export const isUnpaid = ({price = undefined, paid = undefined}) =>
	paid !== price;

export const findLastConsultation = (
	db: TransactionDriver,
	filter?: Filter<ConsultationDocument>,
) =>
	db.findOne(
		Consultations,
		{
			isDone: true,
			...filter,
		},
		{
			sort: {
				datetime: -1,
			},
		},
	);

export const findLastConsultationInInterval = (
	db: TransactionDriver,
	[begin, end]: [Date, Date],
	filter?: Filter<ConsultationDocument>,
) =>
	findLastConsultation(db, {
		datetime: {
			$gte: begin,
			$lt: end,
		},
		...filter,
	});

export const filterNotInRareBooks = () => ({
	book: {
		$nin: books.RARE,
	},
});

export function setupConsultationsStatsPublication(collection, query) {
	// Generate unique key depending on parameters
	const key = statsKey(query);
	const selector = {
		...query,
		isDone: true,
		owner: this.userId,
	};
	const options = {fields: {_id: 1, price: 1, datetime: 1}};

	const minHeap = new PairingHeap(increasing);
	const maxHeap = new PairingHeap(decreasing);
	const refs = new Map();
	let count = 0;
	let total = 0;

	const state = () => ({
		count,
		total,
		first: minHeap.head(),
		last: maxHeap.head(),
	});

	// `observeChanges` only returns after the initial `added` callbacks have run.
	// Until then, we don't want to send a lot of `changed` messages—hence
	// tracking the `initializing` state.
	let initializing = true;
	const handle = Consultations.find(selector, options).observeChanges({
		added: (_id, {price, datetime}) => {
			count += 1;
			if (price) total += price;
			const minRef = minHeap.push(datetime);
			const maxRef = maxHeap.push(datetime);
			refs.set(_id, [price, minRef, maxRef]);

			if (!initializing) {
				this.changed(collection, key, state());
			}
		},

		changed: (_id, fields) => {
			const [oldPrice, minRef, maxRef] = refs.get(_id);
			let newPrice: number = oldPrice;
			if (Object.prototype.hasOwnProperty.call(fields, 'price')) {
				newPrice = fields.price;
				if (oldPrice) total -= oldPrice;
				if (newPrice) total += newPrice;
				refs.set(_id, [newPrice, minRef, maxRef]);
			}

			if (Object.prototype.hasOwnProperty.call(fields, 'datetime')) {
				const datetime = fields.datetime;
				minHeap.update(minRef, datetime);
				maxHeap.update(maxRef, datetime);
			}

			this.changed(collection, key, state());
		},

		removed: (_id) => {
			count -= 1;
			const [price, minRef, maxRef] = refs.get(_id);
			if (price) total -= price;
			minHeap.delete(minRef);
			maxHeap.delete(maxRef);
			refs.delete(_id);
			this.changed(collection, key, state());
		},
	});

	// Instead, we'll send one `added` message right after `observeChanges` has
	// returned, and mark the subscription as ready.
	initializing = false;
	this.added(collection, key, state());

	return handle;
}

function sanitize({
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
	inBookNumber,
	payment_method,
}) {
	check(patientId, String);
	check(datetime, Date);

	if (reason !== undefined) check(reason, String);
	if (done !== undefined) check(done, String);
	if (todo !== undefined) check(todo, String);
	if (treatment !== undefined) check(treatment, String);
	if (next !== undefined) check(next, String);
	if (more !== undefined) check(more, String);

	if (currency !== undefined) check(currency, String);
	if (price !== undefined) check(price, Number);
	if (paid !== undefined) check(paid, Number);
	if (book !== undefined) check(book, String);
	if (inBookNumber !== undefined) check(inBookNumber, Number);
	if (payment_method !== undefined) check(payment_method, String);

	price = Number.isFinite(price) ? price : undefined;
	paid = Number.isFinite(paid) ? paid : undefined;
	inBookNumber =
		Number.isInteger(inBookNumber) && inBookNumber >= 1
			? inBookNumber
			: undefined;

	reason = reason?.trim();
	done = done?.trim();
	todo = todo?.trim();
	treatment = treatment?.trim();
	next = next?.trim();
	more = more?.trim();

	currency = currency?.trim().toUpperCase();
	book = books.sanitize(book || '');

	return {
		patientId,
		datetime,
		realDatetime: datetime,
		begin: datetime,
		reason,
		done,
		todo,
		treatment,
		next,
		more,

		currency,
		price,
		paid,
		unpaid: isUnpaid({price, paid}),
		book,
		inBookNumber,
		payment_method,
		isDone: true,
	};
}

export const computedFields = (owner: string, state, changes) => {
	const isLastConsultation =
		Consultations.findOne({
			owner,
			isDone: true,
			datetime: {$gt: changes.datetime ?? state?.datetime},
		}) === undefined;

	if (!isLastConsultation) return undefined;

	const now = new Date();

	const tolerance = state?.duration ?? DEFAULT_DURATION_IN_MILLISECONDS;

	if (
		state?.doneDatetime !== undefined &&
		differenceInMilliseconds(now, state.doneDatetime) >= tolerance
	) {
		return undefined;
	}

	return {
		doneDatetime: now,
		end: now,
	};
};

export const consultations = {
	sanitize,
};
