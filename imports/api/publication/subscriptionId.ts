export type SubscriptionId = {
	__brand: 'SUBSCRIPTION_ID';
};

export const subscriptionId = () => ({} as SubscriptionId);
