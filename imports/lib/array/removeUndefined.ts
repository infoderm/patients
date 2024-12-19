const removeUndefined = <T extends any[]>(array: T) =>
	array.filter((value: T) => value !== undefined) as {
		[K in keyof T]: T[K] extends {} ? T[K] : never;
	};

export default removeUndefined;
