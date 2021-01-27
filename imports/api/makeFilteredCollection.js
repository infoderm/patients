import {Meteor} from 'meteor/meteor';
import {useTracker} from 'meteor/react-meteor-data';
import {Mongo} from 'meteor/mongo';

const makeFilteredCollection = (
	Collection,
	filterQuery,
	filterOptions,
	name
) => {
	if (Meteor.isServer) {
		Meteor.publish(name, function (publicationQuery, publicationOptions) {
			const selector = {
				...filterQuery,
				...publicationQuery,
				owner: this.userId
			};

			const options = {
				...filterOptions,
				...publicationOptions
			};

			const handle = Collection.find(selector, options).observeChanges({
				added: (_id, fields) => {
					this.added(name, _id, fields);
				},

				changed: (_id, fields) => {
					this.changed(name, _id, fields);
				},

				removed: (_id) => {
					this.removed(name, _id);
				}
			});

			this.onStop(() => handle.stop());
			this.ready();
		});
	}

	const Filtered = new Mongo.Collection(name);

	return (hookQuery = {}, options = undefined, deps = []) =>
		useTracker(() => {
			const handle = Meteor.subscribe(name, undefined, options);
			return {
				loading: !handle.ready(),
				results: Filtered.find(hookQuery, options).fetch()
			};
		}, deps);
};

export default makeFilteredCollection;
