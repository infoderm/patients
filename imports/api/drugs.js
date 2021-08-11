import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';

import mergeFields from '../util/mergeFields';

export const Drugs = new Mongo.Collection('drugs');

if (Meteor.isServer) {
	Meteor.publish('drugs', function () {
		return Drugs.find({owner: this.userId});
	});
	Meteor.publish('drug', function (_id) {
		check(_id, String);
		return Drugs.find({owner: this.userId, _id});
	});
	Meteor.publish('drugs.search', (query, limit) => {
		check(query, String);
		check(limit, Number);
		const sort = {score: {$meta: 'textScore'}};
		// mergeFields below is a temporary type hack to
		// hide the fact that score is not 0/1.
		const fields = mergeFields(sort);
		return Drugs.find(
			{$text: {$search: query}},
			{
				fields,
				sort,
				limit,
			},
		);
	});
}

Meteor.methods({
	'drugs.insertMany'(drugs) {
		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		const createdAt = new Date();
		const owner = this.userId;
		const username = Meteor.users.findOne(this.userId).username;

		for (const drug of drugs) {
			Drugs.insert({
				...drug,
				createdAt,
				owner,
				username,
			});
		}
	},

	'drugs.remove'(drugId) {
		check(drugId, String);
		const drug = Drugs.findOne(drugId);
		if (drug.owner !== this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		return Drugs.remove(drugId);
	},
});
