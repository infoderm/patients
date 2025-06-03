type Target = {
	addEventListener(
		type: string,
		listener: EventListenerOrEventListenerObject,
		options?: boolean | AddEventListenerOptions,
	): void;
	removeEventListener(
		type: string,
		listener: EventListenerOrEventListenerObject,
		options?: boolean | EventListenerOptions,
	): void;
};

const eventSubscription =
	(target: Target | null, event: string, options?: AddEventListenerOptions) =>
	(callback: EventListenerOrEventListenerObject) => {
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		if (target === null) return () => {};

		target.addEventListener(event, callback, options);
		return () => {
			target.removeEventListener(event, callback, Boolean(options?.capture));
		};
	};

export default eventSubscription;
