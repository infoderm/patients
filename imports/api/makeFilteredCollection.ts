import {type DependencyList} from 'react';

import schema from '../util/schema';

import type Collection from './Collection';

import defineCollection from './collection/define';
import define from './publication/define';
import useCursor from './publication/useCursor';
import useSubscription from './publication/useSubscription';
import {AuthenticationLoggedIn} from './Authentication';
import observeSetChanges from './query/observeSetChanges';
import {publishCursorObserver} from './publication/publishCursors';
import type UserQuery from './query/UserQuery';
import queryToSelectorOptionsPair from './query/queryToSelectorOptionsPair';
import {type AuthenticatedContext} from './publication/Context';
import type Query from './query/Query';
import {userQuery} from './query/UserQuery';

const makeFilteredCollection = <
	S extends schema.ZodTypeAny,
	U = schema.infer<S>,
>(
	collection: Collection<schema.infer<S>, U>,
	tSchema: S,
	query: (
		ctx: AuthenticatedContext,
		publicationQuery: UserQuery<schema.infer<S>>,
	) => Query<schema.infer<S>>,
	name: string,
) => {
	const publication = define({
		name,
		authentication: AuthenticationLoggedIn,
		schema: schema.tuple([userQuery(tSchema)]),
		async handle(publicationQuery: UserQuery<schema.infer<S>>) {
			const {filter, ...rest} = query(this, publicationQuery);

			const options = {
				...rest,
				skip: 0,
				limit: 0,
			};

			const handle = await observeSetChanges(
				collection,
				filter,
				options,
				publishCursorObserver(this, name),
			);

			this.onStop(async (error?: Error) => {
				await handle.emit('stop', error);
			});
			this.ready();
		},
	});

	const Filtered = defineCollection<schema.infer<S>, U>(name);

	return (query: UserQuery<schema.infer<S>> | null, deps: DependencyList) => {
		const isLoading = useSubscription(
			publication,
			[{...query, filter: {}}],
			query !== null,
		);
		const loadingSubscription = isLoading();
		const {loading: loadingResults, results} = useCursor(
			query === null
				? () => null
				: () => {
						const [hookSelector, options] = queryToSelectorOptionsPair(query);
						return Filtered.find(hookSelector, options);
				  },
			deps,
		);
		const loading = loadingSubscription || loadingResults;
		return {loading, results};
	};
};

export default makeFilteredCollection;
