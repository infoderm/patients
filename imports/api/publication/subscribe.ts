import {Meteor} from 'meteor/meteor';

import type Args from '../Args';

import type Publication from './Publication';

export type SubscriptionError = Meteor.Error;

export type SubscriptionCallbacks = {
	onReady?: () => void;
	onStop?: (error: SubscriptionError) => void;
};

const subscribe = <A extends Args>(
	{name}: Publication<A>,
	...args: [...A, SubscriptionCallbacks?]
) => Meteor.subscribe(name, ...args);

export default subscribe;
