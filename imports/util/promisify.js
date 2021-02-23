const promisify = (f) => (...args) =>
	new Promise((resolve, reject) => {
		f(...args, (error, result) => {
			if (error) reject(error);
			else resolve(result);
		});
	});

export default promisify;
