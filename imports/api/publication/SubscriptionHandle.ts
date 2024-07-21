import {type Meteor} from 'meteor/meteor';

import type SubscriptionError from './SubscriptionError';

type SubscriptionHandle = {
	key: string;
	handle: Meteor.SubscriptionHandle;
	onReady?: () => void;
	onStop?: (error?: SubscriptionError) => void;
};

export default SubscriptionHandle;
