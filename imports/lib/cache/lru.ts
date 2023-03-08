import assert from 'assert';
import type {
	IDBPCursorWithValue,
	IDBPCursorWithValueIteratorValue,
	IDBPObjectStore,
} from 'idb';

import type {DBSchema, IDBPDatabase} from 'idb/with-async-ittr';

import {openDB} from 'idb/with-async-ittr';

const DEFAULT_DB_NAME = 'cache-lru';
const DB_VERSION = 1;
const STORE = 'store';
const KEY = 'key';
const VALUE = 'value';
const ACCESS = 'access';
const EXPIRY = 'expiry';
const RO = 'readonly';
const RW = 'readwrite';
const ASCENDING = 'next';
const DESCENDING = 'prev';

const upTo = <T>(ub: T) => IDBKeyRange.upperBound(ub, true);

export type Expiry = Date;
export type Access = Date;

export type IDBValidKey = number | string | Date | BufferSource | IDBValidKey[];

export type Fields<V> = {
	[VALUE]: V;
	[EXPIRY]: Expiry;
};

export type Value<K, V> = Fields<V> & {
	[KEY]: K;
	[ACCESS]: Access;
};

export type Schema<K extends IDBValidKey, V> = DBSchema & {
	[STORE]: {
		key: K;
		value: Value<K, V>;
		indexes: {
			[EXPIRY]: Expiry;
			[ACCESS]: Access;
		};
	};
};

export type IndexedField<K extends IDBValidKey, V> = keyof Schema<
	K,
	V
>[typeof STORE]['indexes'];

export type DB<K extends IDBValidKey, V> = IDBPDatabase<Schema<K, V>>;

export type Metadata = {
	[EXPIRY]: Expiry;
	[ACCESS]?: Access;
};

const deleteN = async <K extends IDBValidKey, V>(
	count: number,
	iterable: AsyncIterable<
		IDBPCursorWithValueIteratorValue<
			Schema<K, V>,
			Array<'store'>,
			'store',
			'access' | 'expiry',
			'readwrite'
		>
	>,
): Promise<number> => {
	if (count > 0) {
		for await (const cursor of iterable) {
			await cursor.delete();
			if (--count === 0) return 0;
		}
	}

	return count;
};

const deleteAll = async <K extends IDBValidKey, V>(
	iterable: AsyncIterable<
		IDBPCursorWithValueIteratorValue<
			Schema<K, V>,
			Array<'store'>,
			'store',
			'access' | 'expiry',
			'readwrite'
		>
	>,
): Promise<number> => {
	let count = 0;
	for await (const cursor of iterable) {
		// See https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB#using_an_index
		await cursor.delete();
		++count;
	}

	return count;
};

const expunge = async <K extends IDBValidKey, V>(
	store: Store<K, V, 'readwrite'>,
	count: number,
	now: Date,
): Promise<number> => {
	if (count <= 0) return count;
	// NOTE could also chain the async iterables
	const leftToDelete = await deleteN(
		count,
		store.index(EXPIRY).iterate(upTo(now), ASCENDING),
	);

	assert(leftToDelete >= 0);

	if (leftToDelete === 0) return 0;

	return deleteN(leftToDelete, store.index(ACCESS).iterate(null, ASCENDING));
};

type Store<
	K extends IDBValidKey,
	V,
	M extends IDBTransactionMode,
> = IDBPObjectStore<Schema<K, V>, ArrayLike<typeof STORE>, typeof STORE, M>;
type CursorWithValue<
	K extends IDBValidKey,
	V,
	M extends IDBTransactionMode,
> = IDBPCursorWithValue<
	Schema<K, V>,
	ArrayLike<typeof STORE>,
	typeof STORE,
	unknown,
	M
>;

export class IndexedDBPersistedLRUCache<K extends IDBValidKey, V> {
	readonly #dbPromise: Promise<DB<K, V>>;
	#maxCount: number;

	constructor(dbPromise: Promise<DB<K, V>>, maxCount: number) {
		assert(maxCount > 0);
		this.#dbPromise = dbPromise;
		this.#maxCount = maxCount;
	}

	async resize(maxCount: number) {
		assert(maxCount > 0);
		const store = await this.store(RW);
		const count = await store.count();
		await expunge(store, count - maxCount, new Date());
		this.#maxCount = maxCount;
	}

	async db() {
		return this.#dbPromise;
	}

	async store<M extends IDBTransactionMode>(mode: M): Promise<Store<K, V, M>> {
		return this.db().then((db) =>
			db.transaction([STORE], mode).objectStore(STORE),
		);
	}

	async index(mode: IDBTransactionMode, field: IndexedField<K, V>) {
		return this.store(mode).then((store) => store.index(field));
	}

	async getCursor<M extends IDBTransactionMode>(
		mode: M,
		key: K,
	): Promise<CursorWithValue<K, V, M> | null> {
		const store = await this.store(mode);
		return store.openCursor(key);
	}

	async count() {
		return this.store(RO).then(async (store) => store.count());
	}

	async __set(
		store: Store<K, V, typeof RW>,
		key: K,
		value: V,
		options: Metadata,
	) {
		const cursor = await store.openCursor(key);
		const now = new Date();
		const newDocument = {
			[ACCESS]: now, // TODO handle given access
			key,
			value,
			...options,
		};
		if (cursor === null) {
			const count = await store.count();
			await expunge(store, count + 1 - this.#maxCount, now);
			// Count incremented
			await store.add(newDocument);
		} else {
			// Count unchanged
			await cursor.update(newDocument);
		}
	}

	async set(key: K, value: V, options: Metadata) {
		const store = await this.store(RW);
		await this.__set(store, key, value, options);
	}

	async upsert(
		key: K,
		init: () => Fields<V>,
		update: (value: Value<K, V>) => Fields<V>,
	) {
		const store = await this.store(RW);
		const cursor = await store.openCursor(key);
		if (cursor === null) {
			const {value, ...metadata} = init();
			return this.__set(store, key, value, metadata);
		}

		const newDocument = {
			...cursor.value,
			[ACCESS]: new Date(),
			...update(cursor.value),
		};
		await cursor.update(newDocument);
	}

	async update(key: K, update: (value: Value<K, V>) => Fields<V>) {
		await this.upsert(
			key,
			() => {
				throw new Error('not found');
			},
			update,
		);
	}

	async find(key: K) {
		const now = new Date();
		const cursor = await this.getCursor(RW, key);
		if (cursor === null) return undefined;
		const result = cursor.value;
		if (result[EXPIRY] < now) {
			await cursor.delete();
			return undefined;
		}

		await cursor.update({
			...result,
			[ACCESS]: now,
		});
		return result;
	}

	async get(key: K) {
		const result = await this.find(key);
		if (result === undefined) throw new Error(`not found`);
		return result;
	}

	async has(key: K) {
		const result = await this.find(key);
		return result !== undefined;
	}

	async delete(key: K) {
		return this.db().then(async (db) => db.delete(STORE, key));
	}

	async clear() {
		return this.db().then(async (db) => db.clear(STORE));
	}

	async evict(count: number) {
		const now = new Date();
		const index = await this.index(RW, ACCESS);
		return deleteN(count, index.iterate(upTo(now), ASCENDING));
	}

	async gc() {
		const now = new Date();
		const index = await this.index(RW, EXPIRY);
		return deleteAll(index.iterate(upTo(now)));
	}

	async *[Symbol.asyncIterator]() {
		const index = await this.index(RO, ACCESS);
		yield* index.iterate(null, DESCENDING);
	}

	async toArray() {
		const result: Array<Value<K, V>> = [];
		for await (const cursor of this) {
			result.push(cursor.value);
		}

		return result;
	}
}

export type CacheOptions = {
	dbName?: string;
	dbVersion?: number;
	maxCount: number;
};

export const cache = <K extends IDBValidKey, V>({
	dbName = DEFAULT_DB_NAME,
	dbVersion = DB_VERSION,
	maxCount,
}: CacheOptions) => {
	const dbPromise = openDB<Schema<K, V>>(dbName, dbVersion, {
		upgrade(
			db: IDBPDatabase<Schema<K, V>>,
			oldVersion: number,
			newVersion: number,
		) {
			console.debug(`upgrade ${db.name} from v${oldVersion} to v${newVersion}`);
			if (newVersion === 1) {
				const store = db.createObjectStore(STORE, {keyPath: KEY});
				store.createIndex(EXPIRY, EXPIRY, {unique: false});
				store.createIndex(ACCESS, ACCESS, {unique: false});
			}
		},
		blocked() {
			console.debug(`blocked opening ${dbName} v${dbVersion}`);
		},
		blocking() {
			console.debug(
				`opened ${dbName} v${dbVersion} is blocking schema upgrade`,
			);
		},
		terminated() {
			console.debug(`terminated ${dbName} v${dbVersion}`);
		},
	});

	return new IndexedDBPersistedLRUCache(dbPromise, maxCount);
};
