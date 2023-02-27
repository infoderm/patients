import {Meteor} from 'meteor/meteor';
import {type Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';
import type TransactionDriver from './transaction/TransactionDriver';
import type Filter from './transaction/Filter';
import type Modifier from './Modifier';
import type Context from './endpoint/Context';

type OpReturnValue<T> = Promise<Modifier<T>> | Modifier<T>;

type OpFunction<T> = (
	db: TransactionDriver,
	existing: T,
	...rest: any[]
) => OpReturnValue<T>;

type Op<T> = OpFunction<T> | Modifier<T>;

const unconditionallyUpdateById = <T>(
	Collection: Mongo.Collection<T>,
	op: Op<T>,
	ownerKey = 'owner',
) =>
	async function (
		this: Context,
		db: TransactionDriver,
		_id: string,
		...rest: any[]
	) {
		check(_id, String);

		const selector = {_id, [ownerKey]: this.userId} as unknown as Filter<T>;
		const existing = await db.findOne(Collection, selector);
		if (existing === null) {
			throw new Meteor.Error('not-found');
		}

		const modifier =
			op instanceof Function
				? await Reflect.apply(op, this, [db, existing, ...rest])
				: op;

		return db.updateOne(Collection, {_id} as unknown as Filter<T>, modifier);
	};

export default unconditionallyUpdateById;
