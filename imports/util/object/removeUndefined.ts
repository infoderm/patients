const removeUndefined = <T extends {}>(object: T) =>
	Object.fromEntries(
		Object.entries(object).filter(([_key, value]) => value !== undefined),
	) as {[K in keyof T]: T[K] extends {} ? T[K] : never};

export default removeUndefined;
