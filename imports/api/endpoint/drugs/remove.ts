import {check} from 'meteor/check';

import {Drugs} from '../../drugs';

import define from '../define';

export default define({
	name: 'drugs.remove',
	validate(drugId: string) {
		check(drugId, String);
	},
	run(drugId: String) {
		// TODO make atomic
		const drug = Drugs.findOne(drugId);
		if (drug.owner !== this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		return Drugs.remove(drugId);
	},
});
