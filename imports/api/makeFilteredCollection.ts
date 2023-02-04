import {Mongo} from 'meteor/mongo';
import define from './publication/define';
import useCursor from './publication/useCursor';
import useSubscription from './publication/useSubscription';

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

	return (hookQuery = {}, options = undefined, deps = []) => {
		const isLoading = useSubscription(publication, undefined, options);
		const loading = isLoading();
		const results = useCursor(() => Filtered.find(hookQuery, options), deps);
		return {loading, results};
	};
};

export default makeFilteredCollection;
