import assert from 'assert';

import {Meteor} from 'meteor/meteor';

export const debugMeteorSubscriptions = () => {
	const subscriptions = Meteor.connection._subscriptions;
	console.debug({
		subCount: Object.values(subscriptions).filter(Boolean).length,
	});
};

const subscriptionInternals = (
	handle: Meteor.SubscriptionHandle,
): Meteor.InternalSubscriptionHandle => {
	const id = handle.subscriptionId;
	const subscriptions = Meteor.connection._subscriptions;
	const internals = subscriptions[id];
	assert(
		internals !== undefined,
		`Cannot find internals for subscription ${id}.`,
	);
	return internals;
};

export default subscriptionInternals;
