import {Meteor} from 'meteor/meteor';
import {EJSON} from 'meteor/ejson';

import type Args from '../Args';

import type SubscriptionError from './SubscriptionError';
import {type SubscriptionId} from './subscriptionId';

type MetaHandle = {
	handle: Meteor.SubscriptionHandle;
	internals: Meteor.InternalSubscriptionHandle;
	refCount: number;
	onReady: Map<SubscriptionId, (id: SubscriptionId) => Promise<void> | void>;
	onStop: Map<
		SubscriptionId,
		(id: SubscriptionId, error: SubscriptionError) => Promise<void> | void
	>;
};

const _registry = new Map<string, MetaHandle>();

export const identify = <A extends Args>(name: string, args: A) =>
	EJSON.stringify(
		{userId: Meteor.userId(), name, args},
		{indent: '', canonical: false},
	);

export const get = (key: string) => _registry.get(key);
export const set = (key: string, value: MetaHandle | undefined) => {
	if (value === undefined) {
		_registry.delete(key);
	} else {
		_registry.set(key, value);
	}
};
