import type Collection from '../Collection';
import type Document from '../Document';

import type TransactionDriver from './TransactionDriver';
import {type Options} from './TransactionDriver';

type TransactionExecutor = (txn: (db: TransactionDriver) => any) => any;

export default class TestingTransactionDriver implements TransactionDriver {
	readonly #exec: TransactionExecutor;

	constructor(exec: TransactionExecutor) {
		this.#exec = exec;
	}

	get session() {
		return null;
	}

	insertOne<T extends Document, U = T>(
		Collection: Collection<T, U>,
		doc: Omit<T, '_id'>,
		options?: Options,
	) {
		return this.#exec(async (db) => db.insertOne(Collection, doc, options));
	}

	insertMany<T extends Document, U = T>(
		Collection: Collection<T, U>,
		docs: Array<Omit<T, '_id'>>,
		options?: Options,
	) {
		return this.#exec(async (db) => db.insertMany(Collection, docs, options));
	}

	findOne<T extends Document, U = T>(
		Collection: Collection<T, U>,
		filter,
		options?,
	) {
		return this.#exec(async (db) => db.findOne(Collection, filter, options));
	}

	find<T extends Document, U = T>(
		Collection: Collection<T, U>,
		filter,
		options?,
	) {
		return this.#exec((db) => db.find(Collection, filter, options));
	}

	fetch<T extends Document, U = T>(
		Collection: Collection<T, U>,
		filter,
		options?,
	) {
		return this.#exec(async (db) => db.fetch(Collection, filter, options));
	}

	deleteOne<T extends Document, U = T>(
		Collection: Collection<T, U>,
		filter,
		options?,
	) {
		return this.#exec(async (db) => db.deleteOne(Collection, filter, options));
	}

	deleteMany<T extends Document, U = T>(
		Collection: Collection<T, U>,
		filter,
		options?,
	) {
		return this.#exec(async (db) => db.deleteMany(Collection, filter, options));
	}

	updateOne<T extends Document, U = T>(
		Collection: Collection<T, U>,
		filter,
		update,
		options?,
	) {
		return this.#exec(async (db) =>
			db.updateOne(Collection, filter, update, options),
		);
	}

	updateMany<T extends Document, U = T>(
		Collection: Collection<T, U>,
		filter,
		update,
		options?,
	) {
		return this.#exec(async (db) =>
			db.updateMany(Collection, filter, update, options),
		);
	}

	distinct<T extends Document, U = T>(
		Collection: Collection<T, U>,
		key,
		filter?,
		options?,
	) {
		return this.#exec(async (db) =>
			db.distinct(Collection, key, filter, options),
		);
	}
}
