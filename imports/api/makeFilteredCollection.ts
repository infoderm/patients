import {type DependencyList} from 'react';

import schema from '../lib/schema';

import type Collection from './Collection';
import type Selector from './query/Selector';
import {options} from './query/Options';
import type Options from './query/Options';

import defineCollection from './collection/define';
import define from './publication/define';
import useCursor from './publication/useCursor';
import useSubscription from './publication/useSubscription';
import {AuthenticationLoggedIn} from './Authentication';
import {userFilter} from './query/UserFilter';
import type UserFilter from './query/UserFilter';
import observeSetChanges from './query/observeSetChanges';
import type Filter from './query/Filter';

const makeFilteredCollection = <
	S extends schema.ZodTypeAny,
	U = schema.infer<S>,
>(
	collection: Collection<schema.infer<S>, U>,
	tSchema: S,
	filterSelector: Selector<schema.infer<S>> | undefined,
	filterOptions: Options<schema.infer<S>> | undefined,
	name: string,
) => {
	const publication = define({
		name,
		authentication: AuthenticationLoggedIn,
		schema: schema.tuple([
			userFilter(tSchema).nullable(),
			options(tSchema).nullable(),
		]),
		async handle(
			publicationFilter: UserFilter<schema.infer<S>> | null,
			publicationOptions: Options<schema.infer<S>> | null,
		) {
			const scopedFilter = {
				...filterSelector,
				...publicationFilter,
				owner: this.userId,
			} as Filter<schema.infer<S>>;

			const options = {
				...filterOptions,
				...publicationOptions,
				skip: 0,
				limit: 0,
			};

			const handle = await observeSetChanges(
				collection,
				scopedFilter,
				options,
				{
					added: (_id, fields) => {
						this.added(name, _id, fields);
					},

					changed: (_id, fields) => {
						this.changed(name, _id, fields);
					},

					removed: (_id) => {
						this.removed(name, _id);
					},
				},
			);

			this.onStop(async () => {
				await handle.emit('stop');
			});
			this.ready();
		},
	});

	const Filtered = defineCollection<schema.infer<S>, U>(name);

	return (
		hookSelector: Selector<schema.infer<S>> = {},
		options: Options<schema.infer<S>> | undefined = undefined,
		deps: DependencyList = [],
	) => {
		const isLoading = useSubscription(publication, null, options ?? null);
		const loading = isLoading();
		const results = useCursor(() => Filtered.find(hookSelector, options), deps);
		return {loading, results};
	};
};

export default makeFilteredCollection;
