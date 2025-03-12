import schema from '../../../util/schema';
import {AuthenticationLoggedIn} from '../../Authentication';
import {Appointments} from '../../collection/appointments';

import define from '../define';

export default define({
	name: 'appointments',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([]),
	cursor() {
		return Appointments.find({
			owner: this.userId,
			isDone: false,
		});
	},
});
