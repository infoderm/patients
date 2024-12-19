import type SubscriptionError from './SubscriptionError';
import {type SubscriptionId} from './subscriptionId';

type SubscriptionRegistryEntry = {
	id: SubscriptionId;
	key: string;
	onReady?: (id: SubscriptionId) => Promise<void> | void;
	onStop?: (
		id: SubscriptionId,
		error?: SubscriptionError,
	) => Promise<void> | void;
};

export default SubscriptionRegistryEntry;
