import {check} from 'meteor/check';

import {Drugs} from '../../collection/drugs';

import define from '../define';

export default define({
	name: 'drugs.remove',
	validate(drugId: string) {
		check(drugId, String);
	},
	run(drugId: string) {
		const nRemoved = Drugs.remove({_id: drugId, owner: this.userId});
		if (nRemoved === 0) {
			throw new Meteor.Error('not-found');
		}

		return nRemoved;
	},
});
