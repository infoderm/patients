import {useMemo, useState, type DependencyList} from 'react';

import type Document from '../Document';

import type Args from '../Args';

import type Cursor from './Cursor';

import {subscription} from './Subscription';
import {findClientEffect} from './useFind';
import useSubscriptionEffect from './useSubscriptionEffect';
import type PublicationEndpoint from './PublicationEndpoint';

const useQuery = <A extends Args, T extends Document, U = T>(
	publication: PublicationEndpoint<A>,
	args: A,
	factory: () => Cursor<T, U>,
	deps: DependencyList,
	enabled = true,
) => {
	const cursor = useMemo(factory, deps);

	const [loading, setLoading] = useState<boolean>(enabled);
	const [results, setResults] = useState<U[]>([]);

	let cleanup: (() => void) | undefined;

	useSubscriptionEffect(
		subscription(publication, args, {
			onLoading() {
				setLoading(true);
			},

			onReady() {
				cleanup = findClientEffect(cursor, setLoading, setResults);
			},

			onStop() {
				setLoading(!enabled);
				cleanup?.();
			},
		}),
		[enabled, cursor, setLoading, setResults],
		enabled,
	);

	return {
		loading,
		results,
	};
};

export default useQuery;
