import {Meteor} from 'meteor/meteor';
import {useState, useEffect, useRef} from 'react';

import useChanged from '../../ui/hooks/useChanged';

import type Args from '../Args';

import subscribe from './subscribe';
import type Publication from './Publication';
import type SubscriptionHandle from './SubscriptionHandle';

const useSubscriptionClient = <A extends Args>(
	publication?: Publication<A> | null,
	...args: A
): (() => boolean) => {
	const [loading, setLoading] = useState(true);
	const handleRef = useRef<SubscriptionHandle | null>(null);

	const deps = [setLoading, publication, JSON.stringify(args)];

	useEffect(() => {
		if (!publication) return undefined;
		const setNotLoading = () => {
			if (handleRef.current === handle) setLoading(false);
		};

		const callbacks = {
			onReady: setNotLoading,
			onStop: setNotLoading,
			onError: setNotLoading,
		};

		const handle = subscribe(publication, ...args, callbacks);
		handleRef.current = handle;

		// NOTE `setLoading(true)` is called:
		//   - on first execution,
		//   - on subsequent executions, if the subscription is not ready yet
		//     (e.g. double-render in strict mode in development, concurrent mode)
		//   - when restarting a stopped or errored subscription
		setLoading(!handle.ready());

		return () => {
			handle.stop();
		};
	}, deps);

	const effectWillTrigger = useChanged(deps);
	const userFacingLoadingState = effectWillTrigger || loading;

	return () => userFacingLoadingState;
};

const useSubscriptionServer =
	<A extends Args>(
		// @ts-expect-error Those parameters are not used.
		publication?: Publication<A> | null,
		// @ts-expect-error Those parameters are not used.
		...args: A
	): (() => boolean) =>
	() =>
		false;

const useSubscription = Meteor.isServer
	? useSubscriptionServer
	: useSubscriptionClient;

export default useSubscription;
