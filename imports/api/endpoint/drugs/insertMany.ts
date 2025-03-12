import {AuthenticationLoggedIn} from '../../Authentication';
import schema from '../../../util/schema';

import {drugDocument, Drugs} from '../../collection/drugs';
import type TransactionDriver from '../../transaction/TransactionDriver';

import define from '../define';

export default define({
	name: 'drugs.insertMany',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([schema.array(drugDocument.passthrough(/* TODO */))]),
	async transaction(db: TransactionDriver, drugs) {
		const createdAt = new Date();
		const owner = this.userId;

		await db.insertMany(
			Drugs,
			drugs.map((drug) => ({...drug, createdAt, owner})),
		);

		return undefined;
	},
});
