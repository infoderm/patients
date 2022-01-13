import {check} from 'meteor/check';

import {Drugs} from '../../collection/drugs';
import TransactionDriver from '../../transaction/TransactionDriver';

import define from '../define';

export default define({
	name: 'drugs.insertMany',
	validate(drugs: any[]) {
		for (const drug of drugs) check(drug, Object);
	},
	async transaction(db: TransactionDriver, drugs: any[]) {
		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		const createdAt = new Date();
		const owner = this.userId;

		await db.insertMany(
			Drugs,
			drugs.map((drug) => ({...drug, createdAt, owner})),
		);
	},
});
