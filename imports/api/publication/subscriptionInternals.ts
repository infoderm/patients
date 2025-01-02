import assert from 'assert';

import {Meteor} from 'meteor/meteor';

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
