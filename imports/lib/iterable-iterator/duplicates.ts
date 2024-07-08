const duplicates = function* <T>(items: Iterable<T>): Generator<T> {
	const seen = new Set<T>();
	for (const item of items) {
		if (seen.has(item)) yield item;
		else seen.add(item);
	}
};

export default duplicates;
