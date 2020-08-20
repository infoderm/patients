import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';

import createTagCollection from './createTagCollection.js';

const {Collection: Allergies, operations: allergies} = createTagCollection({
	collection: 'allergies',
	publication: 'allergies',
	singlePublication: 'allergy',
	parentPublication: 'patients-of-allergy',
	key: 'allergies'
});

export {Allergies, allergies};

Meteor.methods({
	'allergies.changeColor'(tagId, newColor) {
		check(tagId, String);
		check(newColor, String);

		const tag = Allergies.findOne(tagId);
		if (!tag) {
			throw new Meteor.Error('not-authorized');
		}

		const owner = tag.owner;
		if (owner !== this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		return Allergies.update(tagId, {$set: {color: newColor}});
	}
});
