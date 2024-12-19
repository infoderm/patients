import type SubscriptionError from './SubscriptionError';
import {type SubscriptionId} from './subscriptionId';

type SubscriptionCallbacks = {
	onSubscribe?: (id: SubscriptionId) => Promise<void> | void;
	onLoading?: (id: SubscriptionId) => Promise<void> | void;
	onReady?: (id: SubscriptionId) => Promise<void> | void;
	onStop?: (
		id: SubscriptionId,
		error?: SubscriptionError,
	) => Promise<void> | void;
};

export default SubscriptionCallbacks;
