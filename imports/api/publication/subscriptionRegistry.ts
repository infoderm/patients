import {type Meteor} from 'meteor/meteor';
import {EJSON} from 'meteor/ejson';

import type Args from '../Args';

import type SubscriptionError from './SubscriptionError';

type MetaHandle = {
	handle: Meteor.SubscriptionHandle;
	refCount: number;
	onReady: Set<() => void>;
	onStop: Set<(error: SubscriptionError) => void>;
};

const _registry = new Map<string, MetaHandle>();

export const identify = <A extends Args>(name: string, params: A[]) =>
	EJSON.stringify({name, params});

export const get = (key: string) => _registry.get(key);
export const set = (key: string, value: MetaHandle | undefined) => {
	if (value === undefined) {
		_registry.delete(key);
	} else {
		_registry.set(key, value);
	}
};
