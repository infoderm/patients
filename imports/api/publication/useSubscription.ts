import {Meteor} from 'meteor/meteor';
import {useTracker} from 'meteor/react-meteor-data';
// import {useSubscribe} from 'meteor/react-meteor-data';

import useHasMounted from '../../ui/hooks/useHasMounted';
import subscribe from './subscribe';
import type Publication from './Publication';

// const useSubscription = ({name}: Publication, ...args: any[]) =>
// useSubscribe(name, ...args);

// What follows is adapted from
// https://github.com/meteor/react-packages/blob/284623702436500a2e01c98feac487ad0e3acdea/packages/react-meteor-data/useSubscribe.ts#L1-L28
// using hasMounted to skip updates that happen before the component has
// mounted.

const useSubscriptionClient = (
	publication?: Publication,
	...args: any[]
): (() => boolean) => {
	const hasMounted = useHasMounted();
	let updateOnReady = false;

	const isReady = useTracker(
		() => !publication || subscribe(publication, ...args).ready(),
		// @ts-expect-error Types are wrong.
		() => !updateOnReady || !hasMounted(),
	);

	return () => {
		updateOnReady = true;
		return !isReady;
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
