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

export const event = (
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
): EventDocument => {
	const patient = Patients.findOne(patientId); // TODO Make reactive (maybe)?
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
		description: patient.phone,
		begin,
		end,
		isCancelled,
		isNoShow,
		uri: `/consultation/${_id}`,
	};
};

export const publishEvents = function (query, options) {
	const handle = Consultations.find(query, options).observe({
		added: ({_id, ...fields}) => {
			this.added(events, _id, event(_id, fields));
		},

		changed: ({_id, ...fields}) => {
			this.changed(events, _id, event(_id, fields));
		},

		removed: ({_id}) => {
			this.removed(events, _id);
		},
	});

	// Mark the subscription as ready.
	this.ready();

	// Stop observing the cursor when the client unsubscribes. Stopping a
	// subscription automatically takes care of sending the client any `removed`
	// messages.
	this.onStop(() => {
		handle.stop();
	});
};

export {default as intersectsInterval} from './interval/intersectsInterval';

export {default as beginsInInterval} from './interval/beginsInInterval';
