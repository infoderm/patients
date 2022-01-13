import TransactionDriver from './TransactionDriver';
import Collection from './Collection';

type TransactionExecutor = (txn: (db: TransactionDriver) => any) => any;

export default class TestingTransactionDriver implements TransactionDriver {
	readonly #exec: TransactionExecutor;

	constructor(exec: TransactionExecutor) {
		this.#exec = exec;
	}

	get session() {
		return null;
	}

	insertOne<T, U = T>(Collection: Collection<T, U>, doc, options?) {
		return this.#exec((db) => db.insertOne(Collection, doc, options));
	}

	insertMany<T, U = T>(Collection: Collection<T, U>, docs, options?) {
		return this.#exec((db) => db.insertMany(Collection, docs, options));
	}

	findOne<T, U = T>(Collection: Collection<T, U>, filter, options?) {
		return this.#exec((db) => db.findOne(Collection, filter, options));
	}

	find<T, U = T>(Collection: Collection<T, U>, filter, options?) {
		return this.#exec((db) => db.find(Collection, filter, options));
	}

	fetch<T, U = T>(Collection: Collection<T, U>, filter, options?) {
		return this.#exec((db) => db.fetch(Collection, filter, options));
	}

	deleteOne<T, U = T>(Collection: Collection<T, U>, filter, options?) {
		return this.#exec((db) => db.deleteOne(Collection, filter, options));
	}

	deleteMany<T, U = T>(Collection: Collection<T, U>, filter, options?) {
		return this.#exec((db) => db.deleteMany(Collection, filter, options));
	}

	updateOne<T, U = T>(Collection: Collection<T, U>, filter, update, options?) {
		return this.#exec((db) =>
			db.updateOne(Collection, filter, update, options),
		);
	}

	updateMany<T, U = T>(Collection: Collection<T, U>, filter, update, options?) {
		return this.#exec((db) =>
			db.updateMany(Collection, filter, update, options),
		);
	}

	distinct<T, U = T>(Collection: Collection<T, U>, key, filter?, options?) {
		return this.#exec((db) => db.distinct(Collection, key, filter, options));
	}
}
