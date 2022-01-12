import Wrapper from './Wrapper';
import Collection from './Collection';

type TransactionWrapper = (txn: (db: Wrapper) => any) => any;

export default class MetaWrapper implements Wrapper {
	readonly #wrap: TransactionWrapper;

	constructor(wrap: TransactionWrapper) {
		this.#wrap = wrap;
	}

	get session() {
		return null;
	}

	insertOne<T, U = T>(Collection: Collection<T, U>, doc, options?) {
		return this.#wrap((db) => db.insertOne(Collection, doc, options));
	}

	insertMany<T, U = T>(Collection: Collection<T, U>, docs, options?) {
		return this.#wrap((db) => db.insertMany(Collection, docs, options));
	}

	findOne<T, U = T>(Collection: Collection<T, U>, filter, options?) {
		return this.#wrap((db) => db.findOne(Collection, filter, options));
	}

	find<T, U = T>(Collection: Collection<T, U>, filter, options?) {
		return this.#wrap((db) => db.find(Collection, filter, options));
	}

	fetch<T, U = T>(Collection: Collection<T, U>, filter, options?) {
		return this.#wrap((db) => db.fetch(Collection, filter, options));
	}

	deleteOne<T, U = T>(Collection: Collection<T, U>, filter, options?) {
		return this.#wrap((db) => db.deleteOne(Collection, filter, options));
	}

	deleteMany<T, U = T>(Collection: Collection<T, U>, filter, options?) {
		return this.#wrap((db) => db.deleteMany(Collection, filter, options));
	}

	updateOne<T, U = T>(Collection: Collection<T, U>, filter, update, options?) {
		return this.#wrap((db) =>
			db.updateOne(Collection, filter, update, options),
		);
	}

	updateMany<T, U = T>(Collection: Collection<T, U>, filter, update, options?) {
		return this.#wrap((db) =>
			db.updateMany(Collection, filter, update, options),
		);
	}

	distinct<T, U = T>(Collection: Collection<T, U>, key, filter?, options?) {
		return this.#wrap((db) => db.distinct(Collection, key, filter, options));
	}
}
