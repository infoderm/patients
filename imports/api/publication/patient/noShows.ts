import startOfToday from 'date-fns/startOfToday';

import {Appointments} from '../../collection/appointments';

import {noShows, type State} from '../../collection/noShows';

import define from '../define';
import {AuthenticationLoggedIn} from '../../Authentication';
import schema from '../../../lib/schema';
import observeSetChanges from '../../query/observeSetChanges';

export default define({
	name: 'patient.noShows',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([schema.string()]),
	async handle(patientId) {
		const Collection = Appointments;
		const collection = noShows;
		const key = patientId;
		const filter = {
			owner: this.userId,
			patientId,
			isDone: false,
			isCancelled: {$in: [false, null!]},
			scheduledDatetime: {$lt: startOfToday()}, // TODO make reactive?
		};
		const options = {fields: {_id: 1}};

		let count = 0;
		const state = (): State => ({count});

		let initializing = true;
		const handle = await observeSetChanges(
			Collection,
			filter,
			options,
			{
				added: (_id, _fields) => {
					count += 1;
					if (!initializing) {
						this.changed(collection, key, state());
					}
				},
				removed: (_id) => {
					count -= 1;
					this.changed(collection, key, state());
				},
			},
			(_fields) => ({}),
		);

		initializing = false;
		this.added(collection, key, state());
		this.onStop(async (error?: Error) => {
			await handle.emit('stop', error);
		});
		this.ready();
	},
});
