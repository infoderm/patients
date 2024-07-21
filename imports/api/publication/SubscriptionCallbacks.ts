import type SubscriptionError from './SubscriptionError';

type SubscriptionCallbacks = {
	onReady?: () => void;
	onStop?: (error?: SubscriptionError) => void;
};

export default SubscriptionCallbacks;
