import {check} from 'meteor/check';
import {beginsInInterval, publishEvents} from '../../events';
import define from '../define';

export default define({
	name: 'events.interval',
	handle(begin: Date, end: Date) {
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
	},
});
