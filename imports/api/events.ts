import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';

import addMilliseconds from 'date-fns/addMilliseconds';
import addMinutes from 'date-fns/addMinutes';
import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';
import startOfToday from 'date-fns/startOfToday';

import {Consultations, DEFAULT_DURATION_IN_MINUTES} from './consultations';
import {Patients} from './collection/patients';

import intersectsInterval from './interval/intersectsInterval';
import beginsInInterval from './interval/beginsInInterval';

export {intersectsInterval, beginsInInterval};

export interface Event {
	owner: string;
	calendar: string;
	title: string;
	begin: Date;
	end: Date;
	isCancelled: boolean;
	isNoShow: boolean;
	uri: string;
}

const events = 'events';
export const Events = new Mongo.Collection<Event>(events);

if (Meteor.isServer) {
	const event = (
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
		},
	): Event => {
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
			begin,
			end,
			isCancelled,
			isNoShow,
			uri: `/consultation/${_id}`,
		};
	};

	const publishEvents = function (query, options) {
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

	Meteor.publish('events.interval', function (begin, end) {
		check(begin, Date);
		check(end, Date);
		const query = {
			...beginsInInterval(begin, end),
			owner: this.userId,
		};

		const options = {
			fields: {
				_id: 1,
				patientId: 1,
				begin: 1,
				end: 1,
				datetime: 1,
				isDone: 1,
				isCancelled: 1,
				duration: 1,
				doneDatetime: 1,
				createdAt: 1,
			},
		};
		publishEvents.call(this, query, options);
	});

	Meteor.publish('events.intersects', function (begin, end) {
		check(begin, Date);
		check(end, Date);
		if (isAfter(begin, end)) throw new Error('begin is after end');
		const query = {
			...intersectsInterval(begin, end),
			owner: this.userId,
		};
		const options = {
			fields: {
				_id: 1,
				patientId: 1,
				begin: 1,
				end: 1,
				datetime: 1,
				isDone: 1,
				isCancelled: 1,
				duration: 1,
				doneDatetime: 1,
				createdAt: 1,
			},
		};
		publishEvents.call(this, query, options);
	});
}
