import {AuthenticationLoggedIn} from '../../Authentication';
import {Appointments} from '../../collection/appointments';

import define from '../define';

export default define({
	name: 'appointments',
	authentication: AuthenticationLoggedIn,
	cursor() {
		return Appointments.find({
			owner: this.userId,
			isDone: false,
		});
	},
});
