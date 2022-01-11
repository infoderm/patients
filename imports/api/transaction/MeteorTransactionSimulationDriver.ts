import {InferIdType} from 'mongodb';

import TransactionDriver from './TransactionDriver';
import Collection from './Collection';

export default class MeteorTransactionSimulationDriver
	implements TransactionDriver
{
	get session() {
		return null;
	}

	insertOne<T, U = T>(Collection: Collection<T, U>, doc, options?) {
		return {
			acknowledged: true,
			insertedId: Collection.insert(
				doc,
				this._makeOptions(options),
			) as unknown as InferIdType<T>,
		};
	}

	insertMany<T, U = T>(Collection: Collection<T, U>, docs, options?) {
		const insertedIds = [];
		for (const doc of docs) {
			const {insertedId} = this.insertOne<T, U>(Collection, doc, options);
			insertedIds.push(insertedId);
		}

		return {
			acknowledged: true,
			insertedCount: docs.length,
			insertedIds,
		};
	}

	findOne<T, U = T>(Collection: Collection<T, U>, filter, options?) {
		return Collection.findOne(filter, this._makeOptions(options)) ?? null;
	}

	find<T, U = T>(Collection: Collection<T, U>, filter, options?) {
		return Collection.find(filter, this._makeOptions(options));
	}

	fetch<T, U = T>(Collection: Collection<T, U>, filter, options?) {
		return this.find<T, U>(Collection, filter, options).fetch();
	}

	deleteOne<T, U = T>(Collection: Collection<T, U>, filter, options?) {
		options = this._makeOptions(options);
		if (filter._id === undefined) {
			const found = this.findOne(Collection, filter, options);
			if (found === null)
				return {
					acknowledged: true,
					deletedCount: 0,
				};
			filter = {_id: found._id, ...filter};
		}

		return {
			acknowledged: true,
			deletedCount: Collection.remove(filter, options),
		};
	}

	deleteMany<T, U = T>(Collection: Collection<T, U>, filter, options?) {
		return {
			acknowledged: true,
			deletedCount: Collection.remove(filter, this._makeOptions(options)),
		};
	}

	updateOne<T, U = T>(Collection: Collection<T, U>, filter, update, options?) {
		const {upsert, ...rest} = options ?? {};
		if (upsert) {
			const {numberAffected, insertedId} = Collection.upsert(
				filter,
				update,
				this._makeOptions(rest),
			);
			if (insertedId) {
				return {
					acknowledged: true,
					matchedCount: 0,
					modifiedCount: 0,
					upsertedCount: 1,
					upsertedId: insertedId,
				};
			}

			return {
				acknowledged: true,
				matchedCount: numberAffected,
				modifiedCount: numberAffected,
				upsertedCount: 0,
			};
		}

		const numberAffected = Collection.update(
			filter,
			update,
			this._makeOptions(rest),
		);

		return {
			acknowledged: true,
			matchedCount: numberAffected,
			modifiedCount: numberAffected,
			upsertedCount: 0,
		};
	}

	updateMany<T, U = T>(Collection: Collection<T, U>, filter, update, options?) {
		const {upsert, ...rest} = options ?? {};
		if (upsert) {
			const {numberAffected, insertedId} = Collection.upsert(
				filter,
				update,
				this._makeOptions({multi: true, ...rest}),
			);
			const upsertedCount = insertedId ? 1 : 0;
			const matchedCount = numberAffected - upsertedCount;
			return {
				acknowledged: true,
				matchedCount,
				modifiedCount: matchedCount,
				upsertedCount,
				upsertedId: insertedId,
			};
		}

		const numberAffected = Collection.update(
			filter,
			update,
			this._makeOptions({multi: true, ...rest}),
		);

		const matchedCount = numberAffected;
		return {
			acknowledged: true,
			matchedCount,
			modifiedCount: matchedCount,
			upsertedCount: 0,
		};
	}

	distinct<T, U = T>(
		_Collection: Collection<T, U>,
		_key,
		_filter?,
		_options?,
	): any[] {
		throw new Error('not implemented');
	}

	private _makeOptions(options) {
		return options;
	}
}
