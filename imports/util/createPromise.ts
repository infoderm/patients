const createPromise = <T>() => {
	let resolve: (value: T | PromiseLike<T>) => void;
	let reject: (reason?: any) => void;

	const promise = new Promise<T>((pResolve, pReject) => {
		resolve = pResolve;
		reject = pReject;
	});

	return {
		promise,
		resolve,
		reject,
	};
};

export default createPromise;
