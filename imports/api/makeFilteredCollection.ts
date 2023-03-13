import {type DependencyList} from 'react';

import Collection from './Collection';
import type Filter from './transaction/Filter';
import type Selector from './Selector';
import type Options from './Options';

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
		handle(publicationFilter?: Filter<T>, publicationOptions?: Options<T>) {
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
		const isLoading = useSubscription(publication, undefined, options);
		const loading = isLoading();
		const results = useCursor(() => Filtered.find(hookSelector, options), deps);
		return {loading, results};
	};
};

export default makeFilteredCollection;
