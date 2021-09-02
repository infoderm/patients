import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';

type OpFunction<T> = (existing: T, ...rest: any[]) => Mongo.Modifier<T>;

type Op<T> = OpFunction<T> | Mongo.Modifier<T>;

const unconditionallyUpdateById = <T>(
	Collection: Mongo.Collection<T>,
	op: Op<T>,
	ownerKey = 'owner',
) =>
	function (this: Meteor.MethodThisType, _id: string, ...rest: any[]) {
		// TODO make atomic
		check(_id, String);

		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		const selector = {_id, [ownerKey]: this.userId} as Mongo.Selector<T>;
		const existing = Collection.findOne(selector);
		if (!existing) {
			throw new Meteor.Error('not-found');
		}

		const options =
			op instanceof Function
				? Reflect.apply(op, this, [existing, ...rest])
				: op;

		return Collection.update(_id, options);
	};

export default unconditionallyUpdateById;
