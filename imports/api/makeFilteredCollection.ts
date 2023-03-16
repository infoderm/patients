import {type DependencyList} from 'react';

import schema from '../lib/schema';
import Collection from './Collection';
import type Filter from './QueryFilter';
import type Selector from './QuerySelector';
import type Options from './QueryOptions';

import define from './publication/define';
import useCursor from './publication/useCursor';
import useSubscription from './publication/useSubscription';
import {AuthenticationLoggedIn} from './Authentication';

const makeFilteredCollection = <T extends {}, U extends {} = T>(
	collection: Collection<T, U>,
	filterSelector: Selector<T> | undefined,
	filterOptions: Options<T> | undefined,
	name: string,
) => {
	const publication = define({
		name,
		authentication: AuthenticationLoggedIn,
		schema: schema.tuple([
			schema
				.object({
					/* TODO Filter<T> */
				})
				.nullable(),
			schema
				.object({
					/* TODO Options<T> */
				})
				.nullable(),
		]),
		handle(
			publicationFilter: Filter<T> | null,
			publicationOptions: Options<T> | null,
		) {
			const selector = {
				...filterSelector,
				...publicationFilter,
				owner: this.userId,
			} as Selector<T>;

			const options = {
				...filterOptions,
				...publicationOptions,
				skip: 0,
				limit: 0,
			};

			const handle = collection.find(selector, options).observeChanges({
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

			this.onStop(() => {
				handle.stop();
			});
			this.ready();
		},
	});

	const Filtered = new Collection<T, U>(name);

	return (
		hookSelector: Selector<T> = {},
		options: Options<T> | undefined = undefined,
		deps: DependencyList = [],
	) => {
		const isLoading = useSubscription(publication, null, options ?? null);
		const loading = isLoading();
		const results = useCursor(() => Filtered.find(hookSelector, options), deps);
		return {loading, results};
	};
};

export default makeFilteredCollection;
