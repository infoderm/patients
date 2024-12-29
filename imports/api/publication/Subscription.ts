import type Args from '../Args';

import type PublicationEndpoint from './PublicationEndpoint';
import type SubscriptionCallbacks from './SubscriptionCallbacks';

export type Subscription<A extends Args> = {
	publication: PublicationEndpoint<A>;
	args: A;
	callbacks?: SubscriptionCallbacks;
};

export const subscription = <A extends Args>(
	publication: PublicationEndpoint<A>,
	args: A,
	callbacks?: SubscriptionCallbacks,
): Subscription<A> => ({publication, args, callbacks});
