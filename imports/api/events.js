import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';

import addMilliseconds from 'date-fns/addMilliseconds';
import addMinutes from 'date-fns/addMinutes';

import {Consultations} from './consultations.js';
import {Patients} from './patients.js';

const DEFAULT_DURATION_IN_MINUTES = 15;

const events = 'events';
export const Events = new Mongo.Collection(events);

if (Meteor.isServer) {
	const event = (
		_id,
		{
			owner,
			patientId,
			datetime,
			isDone,
			isCancelled,
			duration,
			doneDatetime,
			createdAt
		}
	) => {
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

		return {
			owner,
			calendar: isDone ? 'consultations' : 'appointments',
			title: `${patient.lastname} ${patient.firstname}`,
			begin,
			end,
			isCancelled,
			uri: `/consultation/${_id}`
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
			}
		});

		// Mark the subscription as ready.
		this.ready();

		// Stop observing the cursor when the client unsubscribes. Stopping a
		// subscription automatically takes care of sending the client any `removed`
		// messages.
		this.onStop(() => handle.stop());
	};

	Meteor.publish('events.interval', function (begin, end) {
		check(begin, Date);
		check(end, Date);
		const query = {
			owner: this.userId,
			datetime: {
				$gte: begin,
				$lt: end
			}
		};

		const options = {
			fields: {
				_id: 1,
				patientId: 1,
				datetime: 1,
				isDone: 1,
				isCancelled: 1,
				duration: 1,
				doneDatetime: 1,
				createdAt: 1
			}
		};
		return publishEvents.call(this, query, options);
	});
}
