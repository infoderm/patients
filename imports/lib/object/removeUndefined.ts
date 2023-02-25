const removeUndefined = <T>(object: T) =>
	Object.fromEntries(
		Object.entries(object).filter(([_key, value]) => value !== undefined),
	) as Partial<T>;

export default removeUndefined;
