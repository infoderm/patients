import isAfter from 'date-fns/isAfter';

import schema from '../../../util/schema';
import {AuthenticationLoggedIn} from '../../Authentication';
import {intersectsInterval, publishEvents} from '../../events';
import define from '../define';
import PublicationError from '../PublicationError';

export default define({
	name: 'events.intersects',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([schema.date(), schema.date()]),
	async handle(begin, end) {
		if (isAfter(begin, end)) throw new PublicationError('begin is after end');

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

		return publishEvents.call(this, query, options);
	},
});
