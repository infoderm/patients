import type Collection from '../Collection';
import type Document from '../Document';

import type TransactionDriver from './TransactionDriver';
import {type InferIdType, type Options} from './TransactionDriver';

export default class MeteorTransactionSimulationDriver
	implements TransactionDriver
{
	get session() {
		return null;
	}

	async insertOne<T extends Document, U = T>(
		Collection: Collection<T, U>,
		doc: Omit<T, '_id'>,
		options?: Options,
	) {
		const insertedId = (await Collection.insertAsync(
			// @ts-expect-error UnionOmit is not generic enough.
			doc,
			this._makeOptions(options),
		)) as unknown as InferIdType<T>;

		return {
			acknowledged: true,
			insertedId,
		};
	}

	async insertMany<T extends Document, U = T>(
		Collection: Collection<T, U>,
		docs: Array<Omit<T, '_id'>>,
		options?: Options,
	) {
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

	async findOne<T extends Document, U = T>(
		Collection: Collection<T, U>,
		filter,
		options?,
	) {
		const found = await Collection.findOneAsync(
			filter,
			this._makeOptions(options),
		);
		return found ?? null;
	}

	async findOneAndUpdate<T extends Document, U = T>(
		Collection: Collection<T, U>,
		filter,
		update,
		options?: Options,
	) {
		const {upsert, returnDocument, ...rest} = {
			upsert: false,
			returnDocument: 'before',
			...options,
		};
		const found = await this.findOne(Collection, filter, rest);
		let matchedId: string;
		if (found === null) {
			if (!upsert) return null;
			const {insertedId} = await this.insertOne(Collection, filter);
			matchedId = insertedId;
		} else {
			matchedId = found._id;
		}

		await this.updateOne(Collection, {_id: matchedId}, update);

		if (returnDocument === 'before') return found;

		return this.findOne(Collection, {_id: matchedId});
	}

	find<T extends Document, U = T>(
		Collection: Collection<T, U>,
		filter,
		options?,
	) {
		return Collection.find(filter, this._makeOptions(options));
	}

	async fetch<T extends Document, U = T>(
		Collection: Collection<T, U>,
		filter,
		options?,
	) {
		return this.find<T, U>(Collection, filter, options).fetchAsync();
	}

	async deleteOne<T extends Document, U = T>(
		Collection: Collection<T, U>,
		filter,
		options?,
	) {
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

	async deleteMany<T extends Document, U = T>(
		Collection: Collection<T, U>,
		filter,
		options?,
	) {
		const deletedCount = await Collection.removeAsync(
			filter,
			this._makeOptions(options),
		);
		return {
			acknowledged: true,
			deletedCount,
		};
	}

	async updateOne<T extends Document, U = T>(
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
					upsertedId: insertedId as InferIdType<T>,
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

	async updateMany<T extends Document, U = T>(
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
				upsertedId: insertedId as InferIdType<T>,
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

	async distinct<T extends Document, U = T>(
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
