import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';

import startOfToday from 'date-fns/startOfToday';

import {Appointments} from './appointments';

const noShows = 'noShows';
export const NoShows = new Mongo.Collection(noShows);

if (Meteor.isServer) {
	Meteor.publish('patient.noShows', function (patientId) {
		check(patientId, String);

		const Collection = Appointments;
		const collection = noShows;
		const key = patientId;
		const selector = {
			owner: this.userId,
			patientId,
			isDone: false,
			isCancelled: {$in: [false, null]},
			scheduledDatetime: {$lt: startOfToday()} // TODO make reactive?
		};
		const options = {fields: {_id: 1}};

		let count = 0;
		const state = () => ({count});

		let initializing = true;
		const handle = Collection.find(selector, options).observeChanges({
			added: (_id, _fields) => {
				count += 1;
				if (!initializing) {
					this.changed(collection, key, state());
				}
			},
			removed: (_id) => {
				count -= 1;
				this.changed(collection, key, state());
			}
		});

		initializing = false;
		this.added(collection, key, state());
		this.onStop(() => handle.stop());
		this.ready();
	});
}
