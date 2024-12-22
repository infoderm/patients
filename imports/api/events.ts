import assert from 'assert';

import {DiffSequence} from 'meteor/diff-sequence';

import addMilliseconds from 'date-fns/addMilliseconds';
import addMinutes from 'date-fns/addMinutes';
import isBefore from 'date-fns/isBefore';
import startOfToday from 'date-fns/startOfToday';

import {
	type ConsultationDocument,
	Consultations,
} from './collection/consultations';

import {DEFAULT_DURATION_IN_MINUTES} from './consultations';
import {Patients} from './collection/patients';

import {type EventDocument, events} from './collection/events';

import {type Options} from './transaction/TransactionDriver';
import observeSetChanges from './query/observeSetChanges';
import type Filter from './query/Filter';

export const event = async (
	_id: string,
	{
		owner,
		patientId,
		datetime,
		isDone,
		isCancelled,
		duration,
		doneDatetime,
		createdAt,
	}: Omit<ConsultationDocument, '_id'>,
): Promise<EventDocument> => {
	// TODO Maybe some sort of joined view?
	const patient = await Patients.findOneAsync({_id: patientId}); // TODO Make reactive (maybe)?
	assert(patient !== undefined);
	const begin = datetime;
	const end = isDone
		? doneDatetime
			? doneDatetime
			: duration
			? addMilliseconds(begin, duration)
			: createdAt
			? createdAt
			: addMinutes(begin, DEFAULT_DURATION_IN_MINUTES)
		: duration
		? addMilliseconds(begin, duration)
		: addMinutes(begin, DEFAULT_DURATION_IN_MINUTES);

	const isNoShow = !isDone && !isCancelled && isBefore(begin, startOfToday());

	return {
		owner,
		calendar: isDone ? 'consultations' : 'appointments',
		title: `${patient.lastname} ${patient.firstname}`,
		description: patient.phone ?? '',
		begin,
		end,
		isCancelled: Boolean(isCancelled),
		isNoShow,
		uri: `/consultation/${_id}`,
	};
};

export const publishEvents = async function (
	this: Subscription,
	query: Filter<ConsultationDocument>,
	options: Options,
) {
	const docs = new Map();
	const handle = await observeSetChanges(Consultations, query, options, {
		added: async (_id, document: Omit<ConsultationDocument, '_id'>) => {
			docs.set(_id, document);
			const entry = await event(_id, document);
			this.added(events, _id, entry);
			console.debug({what: 'added'});
		},

		changed: async (_id, changes) => {
			const document = docs.get(_id);
			assert(document !== undefined);
			DiffSequence.applyChanges(document, changes);

			const entry = await event(_id, document);
			this.changed(events, _id, entry);
		},

		removed: (_id) => {
			docs.delete(_id);
			this.removed(events, _id);
		},
	});

	// Mark the subscription as ready.
	console.debug({what: 'ready'});
	this.ready();

	// Stop observing the cursor when the client unsubscribes. Stopping a
	// subscription automatically takes care of sending the client any `removed`
	// messages.
	this.onStop(async (error?: Error) => {
		await handle.emit('stop', error);
	});
	console.debug({what: 'publishEvents', query, options});
};

export {default as intersectsInterval} from './interval/intersectsInterval';

export {default as beginsInInterval} from './interval/beginsInInterval';
