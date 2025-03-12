import assert from 'assert';

import {PairingHeap} from '@heap-data-structure/pairing-heap';
import {increasing, decreasing} from '@total-order/date';

import differenceInMilliseconds from 'date-fns/differenceInMilliseconds';

import schema from '../util/schema';

import {books} from './books';

import {
	type ConsultationComputedFields,
	type ConsultationDocument,
	type ConsultationFields,
	Consultations,
} from './collection/consultations';
import {key as statsKey} from './collection/consultations/stats';
import type TransactionDriver from './transaction/TransactionDriver';
import type Filter from './query/Filter';
import type Options from './query/Options';
import {
	type Entry,
	makeSanitize,
	makeComputedFields,
	makeComputeUpdate,
	yieldKey,
	yieldResettableKey,
	type UpdateEntry,
} from './update';
import findOneSync from './publication/findOneSync';
import type Selector from './query/Selector';
import {type AuthenticatedContext} from './publication/Context';
import {type DocumentUpdate} from './DocumentUpdate';
import observeSetChanges from './query/observeSetChanges';

export const DEFAULT_DURATION_IN_MINUTES = 15;
export const DEFAULT_DURATION_IN_SECONDS = DEFAULT_DURATION_IN_MINUTES * 60;
export const DEFAULT_DURATION_IN_MILLISECONDS =
	DEFAULT_DURATION_IN_SECONDS * 1000;

export const isUnpaid = ({
	price = undefined,
	paid = undefined,
}: {
	price?: number;
	paid?: number;
}) => paid !== price;

const findLastConsultationArgs = (
	filter?: Filter<ConsultationDocument>,
): {
	query: Filter<ConsultationDocument>;
	options: Options<ConsultationDocument>;
} => ({
	query: {
		isDone: true,
		...filter,
	},
	options: {
		sort: {
			datetime: -1,
		},
	},
});

const findLastConsultationInIntervalArgs = (
	[begin, end]: [Date, Date],
	filter?: Filter<ConsultationDocument>,
) =>
	findLastConsultationArgs({
		datetime: {
			$gte: begin,
			$lt: end,
		},
		...filter,
	});

export const findLastConsultation = async (
	db: TransactionDriver,
	filter?: Filter<ConsultationDocument>,
) => {
	const {query, options} = findLastConsultationArgs(filter);
	return db.findOne(Consultations, query, options);
};

export const findLastConsultationSync = (
	filter?: Filter<ConsultationDocument>,
) => {
	const {query, options} = findLastConsultationArgs(filter);
	return findOneSync(
		Consultations,
		query as Selector<ConsultationDocument>,
		options,
	);
};

export const findLastConsultationInInterval = async (
	db: TransactionDriver,
	[begin, end]: [Date, Date],
	filter?: Filter<ConsultationDocument>,
) => {
	const {query, options} = findLastConsultationInIntervalArgs(
		[begin, end],
		filter,
	);
	return db.findOne(Consultations, query, options);
};

export const findLastConsultationInIntervalSync = (
	[begin, end]: [Date, Date],
	filter?: Filter<ConsultationDocument>,
) => {
	const {query, options} = findLastConsultationInIntervalArgs(
		[begin, end],
		filter,
	);
	return findOneSync(
		Consultations,
		query as Selector<ConsultationDocument>,
		options,
	);
};

export const filterBookPrefill = () => ({
	book: {
		$regex: books.isRealBookNumberStringRegex,
	},
});

export async function setupConsultationsStatsPublication(
	this: AuthenticatedContext,
	collectionName: string,
	filter: Filter<ConsultationDocument>,
) {
	// Generate unique key depending on parameters
	const key = statsKey(filter);
	const scopedFilter = {
		...filter,
		isDone: true,
		owner: this.userId,
	} as Filter<ConsultationDocument>;
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
	const handle = await observeSetChanges(
		Consultations,
		scopedFilter,
		options,
		{
			added: (_id, {price, datetime}) => {
				count += 1;
				if (price) total += price;
				const minRef = minHeap.push(datetime);
				const maxRef = maxHeap.push(datetime);
				refs.set(_id, [price, minRef, maxRef]);

				if (!initializing) {
					this.changed(collectionName, key, state());
				}
			},

			changed: (_id, fields) => {
				const [oldPrice, minRef, maxRef] = refs.get(_id);
				if (Object.prototype.hasOwnProperty.call(fields, 'price')) {
					const newPrice = fields.price;
					if (oldPrice) total -= oldPrice;
					if (newPrice) total += newPrice;
					refs.set(_id, [newPrice, minRef, maxRef]);
				}

				if (Object.prototype.hasOwnProperty.call(fields, 'datetime')) {
					const datetime = fields.datetime;
					minHeap.update(minRef, datetime);
					maxHeap.update(maxRef, datetime);
				}

				this.changed(collectionName, key, state());
			},

			removed: (_id) => {
				count -= 1;
				const [price, minRef, maxRef] = refs.get(_id);
				if (price) total -= price;
				minHeap.delete(minRef);
				maxHeap.delete(maxRef);
				refs.delete(_id);
				this.changed(collectionName, key, state());
			},
		},
		({price, datetime}) => ({price, datetime}),
	);

	// Instead, we'll send one `added` message right after `observeChanges` has
	// returned, and mark the subscription as ready.
	initializing = false;
	this.added(collectionName, key, state());

	return handle;
}

const trimString = (value: any) => value?.trim();

const sanitizeUpdate = function* (
	fields: DocumentUpdate<ConsultationFields>,
): IterableIterator<
	UpdateEntry<ConsultationFields & ConsultationComputedFields>
> {
	yield* yieldKey(fields, 'patientId', schema.string());

	if (Object.prototype.hasOwnProperty.call(fields, 'datetime')) {
		const datetime = schema.date().parse(fields.datetime);
		yield ['datetime', datetime];
		yield ['realDatetime', datetime];
		yield ['begin', datetime];
	}

	yield* yieldKey(fields, 'reason', schema.string(), trimString);
	yield* yieldResettableKey(fields, 'done', schema.string(), trimString);
	yield* yieldResettableKey(fields, 'todo', schema.string(), trimString);
	yield* yieldResettableKey(fields, 'treatment', schema.string(), trimString);
	yield* yieldResettableKey(fields, 'next', schema.string(), trimString);
	yield* yieldResettableKey(fields, 'more', schema.string(), trimString);

	yield* yieldResettableKey(
		fields,
		'currency',
		schema.string(),
		(currency: string | undefined | null) => currency?.trim().toUpperCase(),
	);
	yield* yieldResettableKey(
		fields,
		'book',
		schema.string(),
		(book: string | undefined | null) => books.sanitize(book ?? ''),
	);
	yield* yieldResettableKey(
		fields,
		'payment_method',
		schema.string(),
		(x) => x,
	);

	yield* yieldResettableKey(
		fields,
		'price',
		schema.number(),
		(price: number | undefined | null) =>
			Number.isFinite(price) ? price! : undefined,
	);
	yield* yieldResettableKey(
		fields,
		'paid',
		schema.number(),
		(paid: number | undefined | null) =>
			Number.isFinite(paid) ? paid! : undefined,
	);
	yield* yieldResettableKey(
		fields,
		'inBookNumber',
		schema.number(),
		(inBookNumber: number | undefined | null) =>
			Number.isInteger(inBookNumber) && inBookNumber! >= 1
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
	} else if (state.doneDatetime === undefined) {
		assert(state.begin !== undefined);
		assert(state.end === undefined);
		yield ['doneDatetime', state.begin];
		yield ['end', state.begin];
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
