import {Meteor} from 'meteor/meteor';
import {Tracker} from 'meteor/tracker';
import {useState, useEffect} from 'react';

import useChanged from '../../ui/hooks/useChanged';

import subscribe from './subscribe';
import type Publication from './Publication';

const useSubscriptionClient = (
	publication?: Publication,
	...args: any[]
): (() => boolean) => {
	const [loading, setLoading] = useState(true);

	const deps = [publication, JSON.stringify(args)];

	useEffect(() => {
		const computation = Tracker.nonreactive(() =>
			Tracker.autorun(() => {
				const ready = !publication || subscribe(publication, ...args).ready();
				setLoading(!ready);
			}),
		);

		// Stop the computation on when publication changes or unmount.
		return () => {
			computation.stop();
		};
	}, deps);

	const effectWillTrigger = useChanged(deps);
	const userFacingLoadingState = effectWillTrigger || loading;

	return () => userFacingLoadingState;
};

const useSubscriptionServer =
	// @ts-expect-error Those parameters are not used.


		(publication?: Publication, ...args: any[]): (() => boolean) =>
		() =>
			false;

const useSubscription = Meteor.isServer
	? useSubscriptionServer
	: useSubscriptionClient;

export default useSubscription;
