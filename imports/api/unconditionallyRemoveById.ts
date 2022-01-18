import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import Wrapper from './transaction/Wrapper';

const unconditionallyRemoveById = (Collection) =>
	async function (this: Meteor.MethodThisType, db: Wrapper, _id: string) {
		check(_id, String);

		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		const item = await db.findOne(Collection, {_id, owner: this.userId});
		if (item === null) {
			throw new Meteor.Error('not-found');
		}

		return db.deleteOne(Collection, {_id});
	};

export default unconditionallyRemoveById;
