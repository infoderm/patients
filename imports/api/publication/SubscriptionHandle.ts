import {type Meteor} from 'meteor/meteor';

import type SubscriptionError from './SubscriptionError';

type SubscriptionHandle = {
	key: string;
	handle: Meteor.SubscriptionHandle;
	onReady?: () => Promise<void> | void;
	onStop?: (error?: SubscriptionError) => Promise<void> | void;
};

export default SubscriptionHandle;
