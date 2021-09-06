import {check} from 'meteor/check';

import {Drugs} from '../../collection/drugs';

import define from '../define';

export default define({
	name: 'drugs.insertMany',
	validate(drugs: any[]) {
		for (const drug of drugs) check(drug, Object);
	},
	run(drugs: any[]) {
		// TODO make atomic
		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		const createdAt = new Date();
		const owner = this.userId;

		for (const drug of drugs) {
			Drugs.insert({
				...drug,
				createdAt,
				owner,
			});
		}
	},
});
