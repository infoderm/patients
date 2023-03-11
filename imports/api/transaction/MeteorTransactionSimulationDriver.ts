import {type InferIdType} from 'mongodb';

import type Collection from '../Collection';
import type TransactionDriver from './TransactionDriver';

export default class MeteorTransactionSimulationDriver
	implements TransactionDriver
{
	get session() {
		return null;
	}

	async insertOne<T, U = T>(Collection: Collection<T, U>, doc, options?) {
		const insertedId = (await Collection.insertAsync(
			doc,
			this._makeOptions(options),
		)) as unknown as InferIdType<T>;

		return {
			acknowledged: true,
			insertedId,
		};
	}

	async insertMany<T, U = T>(Collection: Collection<T, U>, docs, options?) {
		const insertedIds: Array<InferIdType<T>> = [];
		for (const doc of docs) {
			// eslint-disable-next-line no-await-in-loop
			const {insertedId} = await this.insertOne<T, U>(Collection, doc, options);
			insertedIds.push(insertedId);
		}

		return {
			acknowledged: true,
			insertedCount: docs.length,
			insertedIds,
		};
	}

	async findOne<T, U = T>(Collection: Collection<T, U>, filter, options?) {
		const found = await Collection.findOneAsync(
			filter,
			this._makeOptions(options),
		);
		return found ?? null;
	}

	find<T, U = T>(Collection: Collection<T, U>, filter, options?) {
		return Collection.find(filter, this._makeOptions(options));
	}

	async fetch<T, U = T>(Collection: Collection<T, U>, filter, options?) {
		return this.find<T, U>(Collection, filter, options).fetchAsync();
	}

	async deleteOne<T, U = T>(Collection: Collection<T, U>, filter, options?) {
		options = this._makeOptions(options);
		if (filter._id === undefined) {
			const found = await this.findOne(Collection, filter, options);
			if (found === null)
				return {
					acknowledged: true,
					deletedCount: 0,
				};
			filter = {_id: found._id, ...filter};
		}

		const deletedCount = await Collection.removeAsync(filter, options);

		return {
			acknowledged: true,
			deletedCount,
		};
	}

	async deleteMany<T, U = T>(Collection: Collection<T, U>, filter, options?) {
		const deletedCount = await Collection.removeAsync(
			filter,
			this._makeOptions(options),
		);
		return {
			acknowledged: true,
			deletedCount,
		};
	}

	async updateOne<T, U = T>(
		Collection: Collection<T, U>,
		filter,
		update,
		options?,
	) {
		const {upsert, ...rest} = options ?? {};
		if (upsert) {
			const {numberAffected, insertedId} = await Collection.upsertAsync(
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
				matchedCount: numberAffected ?? 0,
				modifiedCount: numberAffected ?? 0,
				upsertedCount: 0,
			};
		}

		const numberAffected = await Collection.updateAsync(
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

	async updateMany<T, U = T>(
		Collection: Collection<T, U>,
		filter,
		update,
		options?,
	) {
		const {upsert, ...rest} = options ?? {};
		if (upsert) {
			const {numberAffected, insertedId} = await Collection.upsertAsync(
				filter,
				update,
				this._makeOptions({multi: true, ...rest}),
			);
			const upsertedCount = insertedId ? 1 : 0;
			const matchedCount = (numberAffected ?? 0) - upsertedCount;
			return {
				acknowledged: true,
				matchedCount,
				modifiedCount: matchedCount,
				upsertedCount,
				upsertedId: insertedId,
			};
		}

		const numberAffected = await Collection.updateAsync(
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

	async distinct<T, U = T>(
		_Collection: Collection<T, U>,
		_key,
		_filter?,
		_options?,
	): Promise<any[]> {
		throw new Error('not implemented');
	}

	private _makeOptions(options) {
		return options;
	}
}
