import schema from '../../../util/schema';
import {AuthenticationLoggedIn} from '../../Authentication';
import {beginsInInterval, publishEvents} from '../../events';
import define from '../define';

export default define({
	name: 'events.interval',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([schema.date(), schema.date()]),
	async handle(begin, end) {
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

		return publishEvents.call(this, query, options);
	},
});
