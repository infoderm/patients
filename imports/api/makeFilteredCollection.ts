import {useTracker} from 'meteor/react-meteor-data';
import {Mongo} from 'meteor/mongo';
import define from './publication/define';
import subscribe from './publication/subscribe';

const makeFilteredCollection = (
	Collection,
	filterQuery,
	filterOptions,
	name: string,
) => {
	const publication = define({
		name,
		handle(publicationQuery, publicationOptions) {
			const selector = {
				...filterQuery,
				...publicationQuery,
				owner: this.userId,
			};

			const options = {
				...filterOptions,
				...publicationOptions,
				skip: 0,
				limit: 0,
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
				},
			});

			this.onStop(() => handle.stop());
			this.ready();
		},
	});

	const Filtered = new Mongo.Collection(name);

	return (hookQuery = {}, options = undefined, deps = []) =>
		useTracker(() => {
			const handle = subscribe(publication, undefined, options);
			return {
				loading: !handle.ready(),
				results: Filtered.find(hookQuery, options).fetch(),
			};
		}, deps);
};

export default makeFilteredCollection;
