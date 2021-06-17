import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';

const unconditionallyUpdateById = (Collection, op, ownerKey = 'owner') =>
	function (this: Meteor.MethodThisType, _id: string, ...rest: any[]) {
		check(_id, String);

		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		const existing = Collection.findOne({_id, [ownerKey]: this.userId});
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
