import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import type TransactionDriver from './transaction/TransactionDriver';
import type Context from './endpoint/Context';

const unconditionallyRemoveById = (Collection) =>
	async function (this: Context, db: TransactionDriver, _id: string) {
		check(_id, String);

		const item = await db.findOne(Collection, {_id, owner: this.userId});
		if (item === null) {
			throw new Meteor.Error('not-found');
		}

		return db.deleteOne(Collection, {_id});
	};

export default unconditionallyRemoveById;
