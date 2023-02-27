type Callback<E, R> = (error: E, result: R) => void;

const promisify =
	<A extends any[], R, E = Error>(
		f: (...args: [...A, Callback<E, R>]) => void,
	) =>
	async (...args: A): Promise<R> =>
		new Promise((resolve, reject) => {
			f(...args, (error: E, result: R) => {
				if (error) reject(error);
				else resolve(result);
			});
		});

export default promisify;
