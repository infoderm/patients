import {ClientSession} from 'mongodb';
import Wrapper, {
	DeleteResult,
	InsertManyResult,
	InsertOneResult,
	Options,
	UpdateResult,
} from './Wrapper';

import Collection from './Collection';

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
		// TODO skip _id creation if it already exists
		// @ts-expect-error _makeNewID is a private method
		const _id = Collection._makeNewID();
		return Collection.rawCollection().insertOne(
			{_id, ...doc},
			this._makeOptions(options),
		) as unknown as Promise<InsertOneResult>;
	}

	async insertMany<T, U = T>(Collection: Collection<T, U>, docs, options?) {
		// TODO skip _id creation if it already exists
		return Collection.rawCollection().insertMany(
			// @ts-expect-error _makeNewID is a private method
			docs.map((doc) => ({_id: Collection._makeNewID(), ...doc})),
			this._makeOptions(options),
		) as unknown as Promise<InsertManyResult>;
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
		return Collection.rawCollection().deleteOne(
			filter,
			this._makeOptions(options),
		) as unknown as Promise<DeleteResult>;
	}

	async deleteMany<T, U = T>(Collection: Collection<T, U>, filter, options?) {
		return Collection.rawCollection().deleteMany(
			filter,
			this._makeOptions(options),
		) as unknown as Promise<DeleteResult>;
	}

	async updateOne<T, U = T>(
		Collection: Collection<T, U>,
		filter,
		update,
		options?,
	) {
		return Collection.rawCollection().updateOne(
			filter,
			update,
			this._makeUpdateOptions<T, U>(Collection, options),
		) as unknown as Promise<UpdateResult>;
	}

	async updateMany<T, U = T>(
		Collection: Collection<T, U>,
		filter,
		update,
		options?,
	) {
		return Collection.rawCollection().updateMany(
			filter,
			update,
			this._makeUpdateOptions<T, U>(Collection, options),
		) as unknown as Promise<UpdateResult>;
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

	private _makeUpdateOptions<T, U = T>(
		Collection: Collection<T, U>,
		options: Options,
	): Options {
		if (options?.upsert && !options?.insertedId) {
			const generatedId = true;
			// @ts-expect-error _makeNewID is a private method
			const insertedId = Collection._makeNewID();
			return {generatedId, insertedId, ...this._makeOptions(options)};
		}

		return this._makeOptions(options);
	}
}
