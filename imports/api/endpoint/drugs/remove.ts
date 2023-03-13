import {check} from 'meteor/check';
import {AuthenticationLoggedIn} from '../../Authentication';

import {Drugs} from '../../collection/drugs';

import define from '../define';

export default define({
	name: 'drugs.remove',
	authentication: AuthenticationLoggedIn,
	validate(drugId: string) {
		check(drugId, String);
	},
	async run(drugId: string) {
		const nRemoved = await Drugs.removeAsync({_id: drugId, owner: this.userId});
		if (nRemoved === 0) {
			throw new Meteor.Error('not-found');
		}

		return nRemoved;
	},
});
