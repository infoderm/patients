import {Meteor} from 'meteor/meteor';
import {type DependencyList, useEffect} from 'react';

import type Args from '../Args';

import stopSubscription from './stopSubscription';
import subscribe from './subscribe';
import {type Subscription} from './Subscription';

export const useSubscriptionEffectClient = <A extends Args>(
	subscription: Subscription<A>,
	deps: DependencyList,
	enabled = true,
): void => {
	useEffect(() => {
		const handle = subscribe(subscription, enabled);

		return () => {
			stopSubscription(handle);
		};
	}, deps);
};

const useSubscriptionEffectServer = <A extends Args>(
	// @ts-expect-error Those parameters are not used.
	subscription: Subscription<A> | null,
	// eslint-disable-next-line @typescript-eslint/no-empty-function
): void => {};

const useSubscriptionEffect = Meteor.isServer
	? useSubscriptionEffectServer
	: useSubscriptionEffectClient;

export default useSubscriptionEffect;
