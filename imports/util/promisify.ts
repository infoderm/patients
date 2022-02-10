const promisify =
	<R>(f) =>
	async (...args: any[]): Promise<R> =>
		new Promise((resolve, reject) => {
			f(...args, (error: Error, result: R) => {
				if (error) reject(error);
				else resolve(result);
			});
		});

export default promisify;
