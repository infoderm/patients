import eventSubscription from './eventSubscription';

const windowEventSubscription = (
	event: string,
	options?: AddEventListenerOptions,
) => eventSubscription(globalThis, event, options);

export default windowEventSubscription;
