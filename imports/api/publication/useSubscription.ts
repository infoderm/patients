import {Meteor} from 'meteor/meteor';
import {Tracker} from 'meteor/tracker';
import {useState, useEffect} from 'react';

import subscribe from './subscribe';
import type Publication from './Publication';

const useSubscriptionClient = (
	publication?: Publication,
	...args: any[]
): (() => boolean) => {
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);
		const computation = Tracker.nonreactive(() =>
			Tracker.autorun(() => {
				const ready = !publication || subscribe(publication, ...args).ready();
				if (updateOnReady) {
					setLoading(!ready);
				}
			}),
		);

		// Stop the computation on when publication changes or unmount.
		return () => {
			computation.stop();
		};
	}, [publication, JSON.stringify(args)]);

	let updateOnReady = false;
	return () => {
		updateOnReady = true;
		return loading;
	};
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
