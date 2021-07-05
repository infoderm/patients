import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';

import {PairingHeap} from '@heap-data-structure/pairing-heap';
import {increasing, decreasing} from '@total-order/date';

import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';
import addMilliseconds from 'date-fns/addMilliseconds';
import differenceInMilliseconds from 'date-fns/differenceInMilliseconds';

import {product} from '@set-theory/cartesian-product';
import {map} from '@iterable-iterator/map';
import {list} from '@iterable-iterator/list';
import {range} from '@iterable-iterator/range';

import {Attachments} from './attachments';
import {Books, books} from './books';
import {parseUint32StrictOrString} from './string';

import pageQuery from './pageQuery';
import makeQuery from './makeQuery';
import unconditionallyUpdateById from './unconditionallyUpdateById';

export const DEFAULT_DURATION_IN_MINUTES = 15;
export const DEFAULT_DURATION_IN_SECONDS = DEFAULT_DURATION_IN_MINUTES * 60;
export const DEFAULT_DURATION_IN_MILLISECONDS =
	DEFAULT_DURATION_IN_SECONDS * 1000;

const collection = 'consultations';
const stats = collection + '.stats';
const statsPublication = stats;

interface ConsultationFields {
	patientId: string;
	datetime: Date;
	scheduledDatetime?: Date;
	realDatetime?: Date;
	begin: Date;
	duration?: number;
	reason: string;
	done?: string;
	todo?: string;
	treatment?: string;
	next?: string;
	more?: string;

	currency?: string;
	price?: number;
	paid?: number;
	unpaid?: boolean;
	book?: string;
	payment_method?: string;
	isDone: boolean;
	isCancelled?: boolean;
	cancellationDatetime?: Date;
	cancellationReason?: string;
	cancellationExplanation?: string;

	attachments?: string[];
}

interface ConsultationComputedFields {
	doneDatetime?: Date;
	end: Date;
}

interface ConsultationMetadata {
	_id: string;
	owner: string;
	createdAt: Date;
	lastModifiedAt?: Date;
}

export type ConsultationDocument = ConsultationFields &
	ConsultationComputedFields &
	ConsultationMetadata;

export const Consultations = new Mongo.Collection<ConsultationDocument>(
	collection
);
const Stats = new Mongo.Collection(stats);

export const useConsultationsFind = makeQuery(Consultations, 'consultations');

export const useConsultationsAndAppointments = makeQuery(
	Consultations,
	'consultationsAndAppointments'
);

export const isUnpaid = ({price = undefined, paid = undefined}) =>
	paid !== price;

const statsKey = (query, init) => JSON.stringify({query, init});

export const findLastConsultation = (filter) =>
	Consultations.findOne(
		{
			isDone: true,
			...filter
		},
		{
			sort: {
				datetime: -1
			}
		}
	);

export const findLastConsultationInInterval = ([begin, end], filter) =>
	findLastConsultation({
		datetime: {
			$gte: begin,
			$lt: end
		},
		...filter
	});

export const filterNotInRareBooks = () => ({
	book: {
		$nin: books.RARE
	}
});

function setupConsultationsStatsPublication(collection, query, init?) {
	// Generate unique key depending on parameters
	const key = statsKey(query, init);
	const selector = {
		...query,
		isDone: true,
		owner: this.userId
	};
	const options = {fields: {_id: 1, price: 1, datetime: 1}};

	const minHeap = new PairingHeap(increasing);
	const maxHeap = new PairingHeap(decreasing);
	const refs = new Map();
	let count = 0;
	let total = 0;

	const state = () => ({
		...init,
		count,
		total,
		first: minHeap.head(),
		last: maxHeap.head()
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
			let newPrice = oldPrice;
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
		}
	});

	// Instead, we'll send one `added` message right after `observeChanges` has
	// returned, and mark the subscription as ready.
	initializing = false;
	this.added(collection, key, state());

	return handle;
}

if (Meteor.isServer) {
	Meteor.publish('consultation', function (_id, options) {
		check(_id, String);
		return Consultations.find(
			{
				owner: this.userId,
				_id
			},
			options
		);
	});

	Meteor.publish('consultations', function (query = {}) {
		return Consultations.find({
			isDone: true,
			...query,
			owner: this.userId
		});
	});

	Meteor.publish('consultations.interval', function (from, to) {
		return Consultations.find({
			owner: this.userId,
			datetime: {
				$gte: from,
				$lt: to
			}
		});
	});

	Meteor.publish('consultations.interval.last', function (from, to, filter) {
		return Consultations.find(
			{
				isDone: true,
				datetime: {
					$gte: from,
					$lt: to
				},
				...filter,
				owner: this.userId
			},
			{
				sort: {
					datetime: -1
				},
				limit: 1
			}
		);
	});

	Meteor.publish('consultations.last', function (filter) {
		return Consultations.find(
			{
				isDone: true,
				...filter,
				owner: this.userId
			},
			{
				sort: {
					datetime: -1
				},
				limit: 1
			}
		);
	});

	Meteor.publish('consultationsAndAppointments', pageQuery(Consultations));

	Meteor.publish('patient.consultations', function (patientId, options) {
		check(patientId, String);
		return Consultations.find(
			{
				owner: this.userId,
				isDone: true,
				patientId
			},
			options
		);
	});

	Meteor.publish(
		'patient.consultationsAndAppointments',
		function (patientId, options) {
			check(patientId, String);
			return Consultations.find(
				{
					owner: this.userId,
					patientId
				},
				options
			);
		}
	);

	Meteor.publish(
		books.options.parentPublication,
		function (name, options = {}) {
			const query = {
				...books.selector(name),
				owner: this.userId,
				isDone: true
			};
			if (options.fields) {
				const {fields, ...rest} = options;
				const _options = {
					...rest,
					fields: {
						...fields
					}
				};
				for (const key of Object.keys(query)) {
					_options.fields[key] = 1;
				}

				return Consultations.find(query, _options);
			}

			return Consultations.find(query, options);
		}
	);

	Meteor.publish(books.options.parentPublicationStats, function (name) {
		check(name, String);

		const collection = books.options.stats;
		const query = books.selector(name);

		const handle = setupConsultationsStatsPublication.call(
			this,
			collection,
			query,
			{name}
		);
		this.ready();

		// Stop observing the cursor when the client unsubscribes. Stopping a
		// subscription automatically takes care of sending the client any `removed`
		// messages.
		this.onStop(() => {
			handle.stop();
		});
	});

	Meteor.publish(statsPublication, function (query) {
		const collection = stats;

		const handle = setupConsultationsStatsPublication.call(
			this,
			collection,
			query
		);
		this.ready();

		// Stop observing the cursor when the client unsubscribes. Stopping a
		// subscription automatically takes care of sending the client any `removed`
		// messages.
		this.onStop(() => {
			handle.stop();
		});
	});
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
	payment_method
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
	if (payment_method !== undefined) check(payment_method, String);

	price = Number.isFinite(price) ? price : 0;
	paid = Number.isFinite(paid) ? paid : 0;

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
		payment_method,
		isDone: true
	};
}

const computedFields = (owner, state, changes) => {
	const isLastConsultation =
		Consultations.findOne({
			owner,
			isDone: true,
			datetime: {$gt: changes.datetime ?? state?.datetime}
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
		end: now
	};
};

const methods = {
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

		const consultations = Consultations.find(
			{
				datetime: {
					$gte: begin,
					$lt: end
				},
				owner: this.userId
			},
			{
				sort: {
					datetime: 1
				}
			}
		).fetch();

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
				product([range(beginYear, endYear), range(beginBook, endBook)])
			)
		);
		const lines = [];

		for (const i of range(maxRows)) {
			const line = [];
			for (const bookSlug of header) {
				if (data[bookSlug]?.[i] !== undefined) {
					line.push(data[bookSlug][i]);
				} else {
					line.push('');
				}
			}

			lines.push(line);
		}

		const table = [];
		table.push(header.join(','));
		for (const line of lines) {
			table.push(line.join(','));
		}

		return table.join('\n');
	},

	'consultations.insert'(consultation) {
		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		const fields = sanitize(consultation);

		if (fields.datetime && fields.book) {
			books.add(this.userId, books.name(fields.datetime, fields.book));
		}

		const createdAt = new Date();
		const lastModifiedAt = createdAt;

		return Consultations.insert({
			...fields,
			...computedFields(this.userId, undefined, fields),
			createdAt,
			lastModifiedAt,
			owner: this.userId
		});
	},

	'consultations.update'(consultationId, newfields) {
		check(consultationId, String);
		const existing = Consultations.findOne({
			_id: consultationId,
			owner: this.userId
		});
		if (!existing) {
			throw new Meteor.Error('not-found');
		}

		const fields = sanitize(newfields);
		if (fields.datetime && fields.book) {
			books.add(this.userId, books.name(fields.datetime, fields.book));
		}

		return Consultations.update(consultationId, {
			$set: {
				...fields,
				...computedFields(this.userId, existing, fields),
				lastModifiedAt: new Date()
			}
		});
	},

	'consultations.attach'(consultationId, uploadId) {
		check(consultationId, String);
		check(uploadId, String);

		const consultation = Consultations.findOne({
			_id: consultationId,
			owner: this.userId
		});
		if (!consultation) {
			throw new Meteor.Error('not-found', 'consultation not found');
		}

		const attachment = Attachments.findOne({
			_id: uploadId,
			userId: this.userId
		});
		if (!attachment) {
			throw new Meteor.Error('not-found', 'attachment not found');
		}

		return Attachments.update(uploadId, {
			$addToSet: {'meta.attachedToConsultations': consultationId}
		});
	},

	'consultations.detach'(consultationId, uploadId) {
		check(consultationId, String);
		check(uploadId, String);

		const consultation = Consultations.findOne({
			_id: consultationId,
			owner: this.userId
		});
		if (!consultation) {
			throw new Meteor.Error('not-found', 'consultation not found');
		}

		const attachment = Attachments.findOne({
			_id: uploadId,
			userId: this.userId
		});
		if (!attachment) {
			throw new Meteor.Error('not-found', 'attachment not found');
		}

		return Attachments.update(uploadId, {
			$pull: {'meta.attachedToConsultations': consultationId}
		});
	},

	'consultations.remove'(consultationId) {
		check(consultationId, String);

		const consultation = Consultations.findOne({
			_id: consultationId,
			owner: this.userId
		});
		if (!consultation) {
			throw new Meteor.Error('not-found');
		}

		Attachments.update(
			{
				userId: this.userId,
				'meta.attachedToConsultations': consultationId
			},
			{
				$pull: {'meta.attachedToConsultations': consultationId}
			},
			{
				multi: true
			}
		);

		return Consultations.remove(consultationId);
	},

	'consultations.restoreAppointment': unconditionallyUpdateById(
		Consultations,
		(existing) => ({
			$set: {
				datetime: existing.scheduledDatetime,
				begin: existing.scheduledDatetime,
				end: addMilliseconds(existing.scheduledDatetime, existing.duration),
				isDone: false
			}
		})
	),
	'books.changeBookNumber'(oldBookId, newBookNumber) {
		check(oldBookId, String);
		check(newBookNumber, String);

		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		const oldBook = Books.findOne({_id: oldBookId, owner: this.userId});
		if (!oldBook) {
			throw new Meteor.Error('not-found');
		}

		const {name: oldName, fiscalYear, bookNumber: oldBookNumber} = oldBook;

		newBookNumber = books.sanitize(newBookNumber);
		if (newBookNumber === '') {
			throw new Meteor.Error('value-error');
		}

		newBookNumber = parseUint32StrictOrString(newBookNumber);
		if (newBookNumber === oldBookNumber) {
			throw new Meteor.Error('value-error');
		}

		const newName = books.format(fiscalYear, newBookNumber);
		const newBookId = books.add(this.userId, newName);

		const query = {
			...books.selector(oldName),
			owner: this.userId,
			isDone: true
		};

		Consultations.update(
			query,
			{
				$set: {book: newBookNumber.toString()}
			},
			{multi: true}
		);

		Books.remove(oldBookId);
		return newBookId;
	}
};

Meteor.methods(methods);

export const consultations = {
	methods,
	sanitize,
	stats: {
		collection: stats,
		publication: statsPublication,
		Collection: Stats,
		key: statsKey
	}
};
