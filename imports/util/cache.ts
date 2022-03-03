import {openDB, DBSchema, IDBPDatabase} from 'idb/with-async-ittr';

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

type Key = string;
type Value = string;
type Expiry = Date;
type Access = Date;

interface Schema extends DBSchema {
	[STORE]: {
		key: Key;
		value: {
			[KEY]: Key;
			[VALUE]: Value;
			[EXPIRY]: Expiry;
			[ACCESS]: Access;
		};
		indexes: {
			[KEY]: Key;
			[EXPIRY]: Expiry;
			[ACCESS]: Access;
		};
	};
}

type IndexedField = keyof Schema[typeof STORE]['indexes'];

type DB = IDBPDatabase<Schema>;

interface Metadata {
	[EXPIRY]: Expiry;
	[ACCESS]: Access;
}

class Cache {
	#dbPromise: Promise<DB>;

	constructor(dbPromise: Promise<DB>) {
		this.#dbPromise = dbPromise;
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

	async count() {
		return this.index(RO, KEY).then(async (keys) => keys.count());
	}

	async set(key: Key, value: Value, options: Metadata) {
		return this.db().then(async (db) => {
			// TODO check and maybe evict based on ACCESS
			await db.put(
				STORE,
				{
					key,
					value,
					...options,
				},
				key,
			);
		});
	}

	async get(key: Key) {
		return this.index(RW, KEY).then(async (keys) => {
			const result = await keys.get(key);
			if (result === undefined) throw new Error(`not found`);
			// TODO check EXPIRY
			// TODO update ACCESS
			return result;
		});
	}

	async has(key: Key) {
		return this.index(RO, KEY).then(async (keys) => {
			const result = await keys.get(key);
			if (result === undefined) return false;
			// TODO check EXPIRY
			// TODO update ACCESS
			return true;
		});
	}

	async delete(key: Key) {
		return this.db().then(async (db) => db.delete(STORE, key));
	}

	async clear() {
		return this.db().then(async (db) => db.clear(STORE));
	}

	async evict(n: number) {
		const now = new Date();
		const index = await this.index(RW, ACCESS);
		const range = IDBKeyRange.upperBound(now, true);
		if (n > 0) {
			for await (const cursor of index.iterate(range, ASCENDING)) {
				await cursor.delete();
				if (--n === 0) break;
			}
		}
	}

	async gc() {
		const now = new Date();
		const index = await this.index(RW, EXPIRY);
		const range = IDBKeyRange.upperBound(now, true);
		for await (const cursor of index.iterate(range)) {
			// see https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB#using_an_index
			await cursor.delete();
		}
	}
}

interface CacheOptions {
	dbName?: string;
	dbVersion?: number;
}

const cache = async ({dbName, dbVersion}: CacheOptions) => {
	dbName = dbName ?? DEFAULT_DB_NAME;
	dbVersion = dbVersion ?? DB_VERSION;

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

	return new Cache(dbPromise);
};

export default cache;
