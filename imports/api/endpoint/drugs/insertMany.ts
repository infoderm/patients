import {check} from 'meteor/check';
import {AuthenticationLoggedIn} from '../../Authentication';

import {Drugs} from '../../collection/drugs';
import type TransactionDriver from '../../transaction/TransactionDriver';

import define from '../define';

export default define({
	name: 'drugs.insertMany',
	authentication: AuthenticationLoggedIn,
	validate(drugs: any[]) {
		for (const drug of drugs) check(drug, Object);
	},
	async transaction(db: TransactionDriver, drugs: any[]) {
		const createdAt = new Date();
		const owner = this.userId;

		await db.insertMany(
			Drugs,
			drugs.map((drug) => ({...drug, createdAt, owner})),
		);

		return undefined;
	},
});
