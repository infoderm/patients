import {check} from 'meteor/check';

import {PairingHeap} from '@heap-data-structure/pairing-heap';
import {increasing, decreasing} from '@total-order/date';

import differenceInMilliseconds from 'date-fns/differenceInMilliseconds';

import {books} from './books';

import {
	ConsultationComputedFields,
	ConsultationDocument,
	ConsultationFields,
	Consultations,
} from './collection/consultations';
import {key as statsKey} from './collection/consultations/stats';
import TransactionDriver from './transaction/TransactionDriver';
import Filter from './transaction/Filter';
import {
	Entry,
	makeSanitize,
	makeComputedFields,
	makeComputeUpdate,
	yieldKey,
	yieldResettableKey,
} from './update';

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

export const filterBookPrefill = () => ({
	book: {
		$regex: books.isRealBookNumberStringRegex,
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

const trimString = (value: string | undefined) => value?.trim();

const sanitizeUpdate = function* (
	fields: Partial<ConsultationFields>,
): IterableIterator<Entry<ConsultationFields & ConsultationComputedFields>> {
	yield* yieldKey(fields, 'patientId', String);

	if (Object.prototype.hasOwnProperty.call(fields, 'datetime')) {
		const {datetime} = fields;
		check(datetime, Date);
		yield ['datetime', datetime];
		yield ['realDatetime', datetime];
		yield ['begin', datetime];
	}

	yield* yieldResettableKey(fields, 'reason', String, trimString);
	yield* yieldResettableKey(fields, 'done', String, trimString);
	yield* yieldResettableKey(fields, 'todo', String, trimString);
	yield* yieldResettableKey(fields, 'treatment', String, trimString);
	yield* yieldResettableKey(fields, 'next', String, trimString);
	yield* yieldResettableKey(fields, 'more', String, trimString);

	yield* yieldResettableKey(
		fields,
		'currency',
		String,
		(currency: string | undefined) => currency?.trim().toUpperCase(),
	);
	yield* yieldResettableKey(
		fields,
		'book',
		String,
		(book: string | undefined) => books.sanitize(book || ''),
	);
	yield* yieldResettableKey(fields, 'payment_method', String, (x) => x);

	yield* yieldResettableKey(
		fields,
		'price',
		Number,
		(price: number | undefined) => (Number.isFinite(price) ? price : undefined),
	);
	yield* yieldResettableKey(
		fields,
		'paid',
		Number,
		(paid: number | undefined) => (Number.isFinite(paid) ? paid : undefined),
	);
	yield* yieldResettableKey(
		fields,
		'inBookNumber',
		Number,
		(inBookNumber: number | undefined) =>
			Number.isInteger(inBookNumber) && inBookNumber >= 1
				? inBookNumber
				: undefined,
	);

	yield ['isDone', true];
};

const sanitize = makeSanitize(sanitizeUpdate);

const computedFieldsGenerator = async function* (
	db: TransactionDriver,
	owner: string,
	state: Partial<ConsultationDocument>,
): AsyncIterableIterator<Entry<ConsultationDocument>> {
	// Update done datetime
	const laterConsultation = await db.findOne(Consultations, {
		owner,
		isDone: true,
		datetime: {$gt: state.datetime},
	});
	const isLastConsultation = laterConsultation === null;

	if (isLastConsultation) {
		const now = new Date();
		const tolerance = state.duration ?? DEFAULT_DURATION_IN_MILLISECONDS;

		if (
			state.doneDatetime === undefined ||
			differenceInMilliseconds(now, state.doneDatetime) < tolerance
		) {
			yield ['doneDatetime', now];
			yield ['end', now];
		}
	}

	// Update unpaid
	yield [
		'unpaid',
		isUnpaid({
			price: state.price,
			paid: state.paid,
		}),
	];
};

const computedFields = makeComputedFields(computedFieldsGenerator);

export const computeUpdate = makeComputeUpdate(computedFields);

export const consultations = {
	sanitize,
};
