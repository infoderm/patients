import {check} from 'meteor/check';

import {Consultations} from '../../collection/consultations';
import define from '../define';

export default define({
	name: 'consultations.interval',
	cursor(from: Date, to: Date) {
		check(from, Date);
		check(to, Date);
		return Consultations.find({
			owner: this.userId,
			datetime: {
				$gte: from,
				$lt: to,
			},
		});
	},
});
