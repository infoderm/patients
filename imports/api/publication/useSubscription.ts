import {Meteor} from 'meteor/meteor';
import {useState, useEffect, useRef} from 'react';

import useChanged from '../../ui/hooks/useChanged';

import type Args from '../Args';

import type PublicationEndpoint from './PublicationEndpoint';
import stopSubscription from './stopSubscription';
import subscribe from './subscribe';

const useSubscriptionClient = <A extends Args>(
	publication?: PublicationEndpoint<A> | null,
	...args: A
): (() => boolean) => {
	const [loading, setLoading] = useState(true);
	const handleRef = useRef<any>(null);

	const deps = [setLoading, publication, JSON.stringify(args)];

	useEffect(() => {
		if (!publication) {
			setLoading(true);
			return undefined;
		}

		const id = {};
		handleRef.current = id;
		const setNotLoading = () => {
			if (handleRef.current === id) setLoading(false);
		};

		const callbacks = {
			onReady: setNotLoading,
			onStop: setNotLoading,
			onError: setNotLoading,
		};

		const handle = subscribe(publication, ...args, callbacks);

		// NOTE `setLoading(true)` is called:
		//   - on first execution,
		//   - on subsequent executions, if the subscription is not ready yet
		//     (e.g. double-render in strict mode in development, concurrent mode)
		//   - when restarting a stopped or errored subscription
		setLoading(!handle.handle.ready());

		return () => {
			stopSubscription(handle);
		};
	}, deps);

	const effectWillTrigger = useChanged(deps);
	const userFacingLoadingState = effectWillTrigger || loading;

	return () => userFacingLoadingState;
};

const useSubscriptionServer =
	<A extends Args>(
		// @ts-expect-error Those parameters are not used.
		publication?: PublicationEndpoint<A> | null,
		// @ts-expect-error Those parameters are not used.
		...args: A
	): (() => boolean) =>
	() =>
		false;

const useSubscription = Meteor.isServer
	? useSubscriptionServer
	: useSubscriptionClient;

export default useSubscription;
