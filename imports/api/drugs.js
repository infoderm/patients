import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';

import mergeFields from '../util/mergeFields';

import {Drugs} from './collection/drugs';

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
