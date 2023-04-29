const windowEventSubscription =
	(event: string) => (callback: EventListenerOrEventListenerObject) => {
		window.addEventListener(event, callback);
		return () => {
			window.removeEventListener(event, callback);
		};
	};

export default windowEventSubscription;
