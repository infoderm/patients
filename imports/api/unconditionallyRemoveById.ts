import {Meteor} from 'meteor/meteor';

import type TransactionDriver from './transaction/TransactionDriver';

import type Collection from './Collection';
import type Filter from './query/Filter';
import {type AuthenticatedContext} from './endpoint/Context';

type Base = {
	_id: string;
	owner: string;
};

const unconditionallyRemoveById = <T extends Base, U extends Base = T>(
	collection: Collection<T, U>,
) =>
	async function (
		this: AuthenticatedContext,
		db: TransactionDriver,
		_id: string,
	) {
		const item = await db.findOne(collection, {
			_id,
			owner: this.userId,
		} as Filter<T>);
		if (item === null) {
			throw new Meteor.Error('not-found');
		}

		return db.deleteOne(collection, {_id} as Filter<T>);
	};

export default unconditionallyRemoveById;
