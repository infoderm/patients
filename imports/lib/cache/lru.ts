import assert from 'assert';
import {openDB, type DBSchema, type IDBPDatabase} from 'idb/with-async-ittr';

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

const upTo = <T>(ub: T) => IDBKeyRange.upperBound(ub, true);

type Key = string;
type Value = string;
type Expiry = Date;
type Access = Date;

type Schema = {
	[STORE]: {
		key: Key;
		value: {
			[KEY]: Key;
			[VALUE]: Value;
			[EXPIRY]: Expiry;
			[ACCESS]: Access;
		};
		indexes: {
			[EXPIRY]: Expiry;
			[ACCESS]: Access;
		};
	};
} & DBSchema;

type IndexedField = keyof Schema[typeof STORE]['indexes'];

type DB = IDBPDatabase<Schema>;

type Metadata = {
	[EXPIRY]: Expiry;
	[ACCESS]?: Access;
};

export class IndexedDBPersistedLRUCache {
	readonly #dbPromise: Promise<DB>;
	readonly #maxCount: number;

	constructor(dbPromise: Promise<DB>, maxCount: number) {
		assert(maxCount > 0);
		this.#dbPromise = dbPromise;
		this.#maxCount = maxCount;
	}

	async db() {
		return this.#dbPromise;
	}

	async store(mode: IDBTransactionMode) {
		return this.db().then((db) =>
			db.transaction([STORE], mode).objectStore(STORE),
		);
	}

	async index(mode: IDBTransactionMode, field: IndexedField) {
		return this.store(mode).then((store) => store.index(field));
	}

	async getCursor(mode: IDBTransactionMode, key: Key) {
		const store = await this.store(mode);
		return store.openCursor(key);
	}

	async count() {
		return this.store(RO).then(async (store) => store.count());
	}

	async set(key: Key, value: Value, options: Metadata) {
		const store = await this.store(RW);
		const cursor = await store.openCursor(key);
		const now = new Date();
		const newDocument = {
			[ACCESS]: now,
			key,
			value,
			...options,
		};
		if (cursor === null) {
			const count = await store.count();
			assert(count <= this.#maxCount); // TODO handle resizing
			if (count === this.#maxCount) {
				// Count unchanged
				let available;
				const expired = await store
					.index(EXPIRY)
					.openCursor(upTo(now), ASCENDING);
				if (expired === null) {
					const lru = await store.index(ACCESS).openCursor(null, ASCENDING);
					assert(lru !== null);
					available = lru;
				} else {
					available = expired;
				}

				await available.update(newDocument);
			} else {
				// Count incremented
				await store.add(newDocument);
			}
		} else {
			// Count unchanged
			await cursor.update(newDocument);
		}
	}

	async find(key: Key) {
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

	async get(key: Key) {
		const result = this.find(key);
		if (result === undefined) throw new Error(`not found`);
		return result;
	}

	async has(key: Key) {
		const result = this.find(key);
		return result !== undefined;
	}

	async delete(key: Key) {
		return this.db().then(async (db) => db.delete(STORE, key));
	}

	async clear() {
		return this.db().then(async (db) => db.clear(STORE));
	}

	async evict(count: number) {
		const now = new Date();
		const index = await this.index(RW, ACCESS);
		if (count > 0) {
			for await (const cursor of index.iterate(upTo(now), ASCENDING)) {
				await cursor.delete();
				if (--count === 0) break;
			}
		}
	}

	async gc() {
		const now = new Date();
		const index = await this.index(RW, EXPIRY);
		for await (const cursor of index.iterate(upTo(now))) {
			// see https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB#using_an_index
			await cursor.delete();
		}
	}
}

type CacheOptions = {
	dbName?: string;
	dbVersion?: number;
	maxCount: number;
};

const cache = ({
	dbName = DEFAULT_DB_NAME,
	dbVersion = DB_VERSION,
	maxCount,
}: CacheOptions) => {
	const dbPromise = openDB<Schema>(dbName, dbVersion, {
		upgrade(db, oldVersion, newVersion) {
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

export default cache;
