import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';

const unconditionallyRemoveById = (Collection) =>
	function (this: Meteor.MethodThisType, _id: string) {
		check(_id, String);

		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		const item = Collection.findOne({_id, owner: this.userId});
		if (!item) {
			throw new Meteor.Error('not-found');
		}

		return Collection.remove(_id);
	};

export default unconditionallyRemoveById;
