import {ClientSession} from 'mongodb';
import Wrapper, {IdType, IdTypes, Options} from './Wrapper';

import Collection from './Collection';
import Filter from './Filter';

export default class MongoDBClientSessionWrapper implements Wrapper {
	readonly #session: ClientSession;

	constructor(session: ClientSession) {
		this.#session = session;
	}

	get session() {
		return this.#session;
	}

	async insertOne<T, U = T>(
		Collection: Collection<T, U>,
		doc,
		options?: Options,
	) {
		return insertOneWriteOpResultObjectToInsertOneResult(
			await Collection.rawCollection().insertOne(
				// TODO skip _id creation if it already exists
				// @ts-expect-error _makeNewID is a private method
				{_id: Collection._makeNewID(), ...doc},
				this._makeOptions(options),
			),
		);
	}

	async insertMany<T, U = T>(Collection: Collection<T, U>, docs, options?) {
		return insertWriteOpResultObjectToInsertManyResult(
			await Collection.rawCollection().insertMany(
				// TODO skip _id creation if it already exists
				// @ts-expect-error _makeNewID is a private method
				docs.map((doc) => ({_id: Collection._makeNewID(), ...doc})),
				this._makeOptions(options),
			),
		);
	}

	async findOne<T, U = T>(
		Collection: Collection<T, U>,
		filter,
		options?: Options,
	) {
		return Collection.rawCollection().findOne(
			filter,
			this._makeOptions(options),
		) as unknown as Promise<null | T>;
	}

	find<T, U = T>(Collection: Collection<T, U>, filter, options?) {
		return Collection.rawCollection().find(filter, this._makeOptions(options));
	}

	async fetch<T, U = T>(Collection: Collection<T, U>, filter, options?) {
		return this.find<T, U>(Collection, filter, options).toArray();
	}

	async deleteOne<T, U = T>(Collection: Collection<T, U>, filter, options?) {
		return deleteWriteOpResultToDeleteResult(
			await Collection.rawCollection().deleteOne(
				filter,
				this._makeOptions(options),
			),
		);
	}

	async deleteMany<T, U = T>(Collection: Collection<T, U>, filter, options?) {
		return deleteWriteOpResultToDeleteResult(
			await Collection.rawCollection().deleteMany(
				filter,
				this._makeOptions(options),
			),
		);
	}

	async updateOne<T, U = T>(
		Collection: Collection<T, U>,
		filter,
		update,
		options?,
	) {
		return updateWriteOpResultToUpdateResult(
			await Collection.rawCollection().updateOne(
				filter,
				this._makeUpdate<T, U>(Collection, filter, update, options),
				this._makeOptions(options),
			),
		);
	}

	async updateMany<T, U = T>(
		Collection: Collection<T, U>,
		filter,
		update,
		options?,
	) {
		return updateWriteOpResultToUpdateResult(
			await Collection.rawCollection().updateMany(
				filter,
				this._makeUpdate<T, U>(Collection, filter, update, options),
				this._makeOptions(options),
			),
		);
	}

	async distinct<T, U = T>(
		Collection: Collection<T, U>,
		key,
		filter?,
		options?,
	) {
		return Collection.rawCollection().distinct(
			key,
			filter ?? {},
			this._makeOptions(options),
		);
	}

	private _makeOptions(options: Options): Options {
		return {session: this.#session, ...options};
	}

	private _makeUpdate<T, U = T>(
		Collection: Collection<T, U>,
		filter: Filter<T>,
		update: any,
		options: Options,
	): any {
		if (!options?.upsert) return update;
		// @ts-expect-error _makeNewID is a private method
		const insertedId = filter?._id ?? Collection._makeNewID();
		const {$setOnInsert, ...rest} = update;
		return {
			...rest,
			$setOnInsert: {
				...$setOnInsert,
				_id: insertedId,
			},
		};
	}
}

const updateWriteOpResultToUpdateResult = ({
	result: {ok},
	matchedCount,
	modifiedCount,
	upsertedId,
}) => {
	const upsertedCount = upsertedId === null ? 0 : 1;

	if (upsertedCount === 0) {
		return {
			acknowledged: Boolean(ok),
			matchedCount,
			modifiedCount,
			upsertedCount,
		};
	}

	return {
		acknowledged: Boolean(ok),
		matchedCount,
		modifiedCount,
		upsertedCount,
		upsertedId: upsertedId._id as unknown as IdType,
	};
};

const deleteWriteOpResultToDeleteResult = (op) => ({
	acknowledged: Boolean(op.result.ok),
	deletedCount: op.deletedCount,
});

const insertOneWriteOpResultObjectToInsertOneResult = ({
	result: {ok},
	insertedId,
}) => ({
	acknowledged: Boolean(ok),
	insertedId: insertedId as unknown as IdType,
});

const insertWriteOpResultObjectToInsertManyResult = ({
	result: {ok},
	insertedCount,
	insertedIds,
}) => ({
	acknowledged: Boolean(ok),
	insertedCount,
	insertedIds: insertedIds as unknown as IdTypes,
});
