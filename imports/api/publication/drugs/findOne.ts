import {check} from 'meteor/check';
import {AuthenticationLoggedIn} from '../../Authentication';

import {Drugs} from '../../collection/drugs';
import define from '../define';

export default define({
	name: 'drug',
	authentication: AuthenticationLoggedIn,
	cursor(_id: string) {
		check(_id, String);
		return Drugs.find({owner: this.userId, _id});
	},
});
