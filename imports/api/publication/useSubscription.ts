import {Meteor} from 'meteor/meteor';
import {useState, useRef, useMemo} from 'react';

import useChanged from '../../ui/hooks/useChanged';

import type Args from '../Args';

import type PublicationEndpoint from './PublicationEndpoint';
import {useSubscriptionEffectClient} from './useSubscriptionEffect';
import {subscription} from './Subscription';
import {type SubscriptionId} from './subscriptionId';

const useSubscriptionClient = <A extends Args>(
	publication: PublicationEndpoint<A>,
	args: A,
	enabled = true,
): (() => boolean) => {
	const [loading, setLoading] = useState(true);
	const handleRef = useRef<SubscriptionId | null>(null);

	const deps = [handleRef, setLoading, publication, JSON.stringify(args)];

	const sub = useMemo(() => {
		const setNotLoading = (id: SubscriptionId) => {
			setLoading((prev) => (handleRef.current === id ? false : prev));
		};

		return subscription(publication, args, {
			onSubscribe(id: SubscriptionId) {
				handleRef.current = id;
			},
			onLoading(id: SubscriptionId) {
				// NOTE `setLoading(true)` is called:
				//   - on first execution,
				//   - on subsequent executions, if the subscription is not ready yet
				//     (e.g. double-render in strict mode in development, concurrent mode)
				//   - when restarting a stopped or errored subscription
				setLoading((prev) => (handleRef.current === id ? true : prev));
			},
			onReady: setNotLoading,
			onStop: setNotLoading,
		});
	}, deps);

	useSubscriptionEffectClient(sub, [sub, enabled], enabled);

	const effectWillTrigger = useChanged([sub, enabled]);
	const userFacingLoadingState = effectWillTrigger || loading;

	return () => userFacingLoadingState;
};

const useSubscriptionServer =
	<A extends Args>(
		// @ts-expect-error Those parameters are not used.
		publication: PublicationEndpoint<A> | null,
		// @ts-expect-error Those parameters are not used.
		args: A,
		// @ts-expect-error Those parameters are not used.
		enabled = true,
	): (() => boolean) =>
	() =>
		false;

const useSubscription = Meteor.isServer
	? useSubscriptionServer
	: useSubscriptionClient;

export default useSubscription;
