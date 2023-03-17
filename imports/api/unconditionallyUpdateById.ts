import {Meteor} from 'meteor/meteor';

import type Args from './Args';

import type TransactionDriver from './transaction/TransactionDriver';
import type Filter from './query/Filter';
import type Collection from './Collection';
import type Document from './Document';
import type Modifier from './Modifier';
import {type AuthenticatedContext} from './endpoint/Context';

type OpReturnValue<T> = Promise<Modifier<T>> | Modifier<T>;

type OpFunction<A extends Args, T> = (
	db: TransactionDriver,
	existing: T,
	...rest: A
) => OpReturnValue<T>;

type Op<A extends Args, T> = OpFunction<A, T> | Modifier<T>;

const unconditionallyUpdateById = <A extends Args, T extends Document, U = T>(
	collection: Collection<T, U>,
	op: Op<A, T>,
	ownerKey = 'owner',
) =>
	async function (
		this: AuthenticatedContext,
		db: TransactionDriver,
		_id: string,
		...rest: A
	) {
		const selector = {_id, [ownerKey]: this.userId} as unknown as Filter<T>;
		const existing = await db.findOne(collection, selector);
		if (existing === null) {
			throw new Meteor.Error('not-found');
		}

		const modifier =
			op instanceof Function
				? await Reflect.apply(op, this, [db, existing, ...rest])
				: op;

		return db.updateOne(collection, {_id} as unknown as Filter<T>, modifier);
	};

export default unconditionallyUpdateById;
