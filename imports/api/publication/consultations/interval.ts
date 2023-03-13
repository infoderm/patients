import schema from '../../../lib/schema';
import {AuthenticationLoggedIn} from '../../Authentication';

import {Consultations} from '../../collection/consultations';
import define from '../define';

export default define({
	name: 'consultations.interval',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([schema.date(), schema.date()]),
	cursor(from, to) {
		return Consultations.find({
			owner: this.userId,
			datetime: {
				$gte: from,
				$lt: to,
			},
		});
	},
});
