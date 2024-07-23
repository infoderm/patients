import type SubscriptionError from './SubscriptionError';

type SubscriptionCallbacks = {
	onReady?: () => Promise<void> | void;
	onStop?: (error?: SubscriptionError) => Promise<void> | void;
};

export default SubscriptionCallbacks;
