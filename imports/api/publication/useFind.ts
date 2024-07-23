import assert from 'assert';

import {type Mongo} from 'meteor/mongo';
import {useMemo, useEffect, type DependencyList, useState} from 'react';

import type Document from '../Document';

const useFindClient = <T extends Document, U = T>(
	factory: () => Mongo.Cursor<T, U> | null,
	deps: DependencyList = [],
) => {
	const cursor = useMemo(factory, deps);

	const [loading, setLoading] = useState<boolean>(cursor !== null);
	const [results, setResults] = useState<U[]>([]);

	useEffect(() => {
		if (cursor === null) {
			setLoading(false);
			return;
		}

		setLoading(true);

		let initializing = true;
		let stopped = false;
		const init: U[] = [];
		let handle: Mongo.ObserveHandle;

		cursor
			.observeAsync({
				addedAt(document, atIndex, _before) {
					if (initializing) {
						assert(
							atIndex === init.length,
							`incorrect atIndex during init: ${atIndex} !== ${init.length}`,
						);
						init.push(document);
					} else {
						setResults((results) => [
							...results.slice(0, atIndex),
							document,
							...results.slice(atIndex),
						]);
					}
				},

				changedAt(newDocument, _oldDocument, atIndex) {
					assert(!initializing, `changedAt called during init`);
					setResults((data) => [
						...data.slice(0, atIndex),
						newDocument,
						...data.slice(atIndex + 1),
					]);
				},

				removedAt(_oldDocument, atIndex) {
					assert(!initializing, `removedAt called during init`);
					setResults((data) => [
						...data.slice(0, atIndex),
						...data.slice(atIndex + 1),
					]);
				},

				movedTo(_document, fromIndex, toIndex, _before) {
					assert(!initializing, `movedTo called during init`);
					setResults((data) => {
						const doc = data[fromIndex]!;
						const copy = [
							...data.slice(0, fromIndex),
							...data.slice(fromIndex + 1),
						];
						copy.splice(toIndex, 0, doc);
						return copy;
					});
				},
			})
			.then((_handle) => {
				initializing = false;
				if (stopped) {
					_handle.stop();
					return;
				}

				setResults(init);
				setLoading(false);
				handle = _handle;
			})
			.catch((error: unknown) => {
				setLoading(false);
				console.error({error});
			});

		return () => {
			stopped = true;
			if (handle !== undefined) handle.stop();
		};
	}, [cursor]);

	return {loading, results};
};

const useFind = useFindClient;

export default useFind;
