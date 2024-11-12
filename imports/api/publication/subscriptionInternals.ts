import assert from 'assert';

import {Meteor} from 'meteor/meteor';

let prev = '';

export const debugMeteorSubscriptions = () => {
	const subscriptions = Meteor.connection._subscriptions;
	const subs = Object.values(subscriptions).filter(Boolean);
	const next = JSON.stringify({
		subCount: subs.length,
		subs: subs.map(({name, params}) => ({name, params})),
	}, undefined, 2);

	if (next !== prev) {
		console.debug(next);
		prev = next;
	}
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
