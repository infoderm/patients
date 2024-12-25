import assert from 'assert';

import {type DependencyList} from 'react';

import type PublicationEndpoint from './publication/PublicationEndpoint';
import useQuery from './publication/useQuery';

import type Collection from './Collection';
import type Document from './Document';
import type UserQuery from './query/UserQuery';
import queryToSelectorOptionsPair from './query/queryToSelectorOptionsPair';

const makeQuery =
	<T extends Document, U = T>(
		collection: Collection<T, U>,
		publication: PublicationEndpoint<[UserQuery<T>]>,
	) =>
	(query: UserQuery<T> | null, deps: DependencyList) => {
		return useQuery(
			publication,
			[query],
			() => {
				assert(query !== null);
				const [selector, options] = queryToSelectorOptionsPair(query);
				return collection.find(selector, options);
			},
			deps,
			query !== null,
		);
	};

export default makeQuery;
