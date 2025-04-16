import {useState, useEffect} from 'react';

export type Cache<T> = Map<string, T>;

export const load = async <T>(
	kind: string,
	cache: Cache<T>,
	load: (key: string) => Promise<T>,
	key: string,
): Promise<T | undefined> => {
	if (cache.has(key)) {
		return cache.get(key);
	}

	return load(key).then(
		(value) => {
			cache.set(key, value);
			return value;
		},
		(error) => {
			const message = error instanceof Error ? error.message : 'unknown error';
			console.error(`failed to load ${kind} ${key}: ${message}`);
			console.debug({error});
			return undefined;
		},
	);
};

export const useLoadedValue = <T>(
	kind: string,
	cache: Cache<T>,
	load: (key: string) => Promise<T>,
	key: string,
): T | undefined => {
	const [lastLoadedValue, setLastLoadedValue] = useState<T | undefined>(
		undefined,
	);

	useEffect(() => {
		if (cache.has(key)) {
			setLastLoadedValue(cache.get(key));
			return undefined;
		}

		let isCancelled = false;
		load(key).then(
			(value) => {
				cache.set(key, value);
				if (!isCancelled) {
					setLastLoadedValue(value);
				}
			},
			(error) => {
				const message =
					error instanceof Error ? error.message : 'unknown error';
				console.error(`failed to load ${kind} ${key}: ${message}`);
				console.debug({error});
			},
		);
		return () => {
			isCancelled = true;
		};
	}, [key, setLastLoadedValue]);

	return cache.has(key) ? cache.get(key) : lastLoadedValue;
};
