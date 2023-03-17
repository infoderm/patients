import {type ClientSession} from 'mongodb';
import type Collection from '../Collection';
import type Document from '../Document';
import type Filter from '../query/Filter';
import {type Options, type UpdateResult} from './TransactionDriver';
import type TransactionDriver from './TransactionDriver';

export default class MongoTransactionExecutionDriver
	implements TransactionDriver
{
	readonly #session: ClientSession;

	constructor(session: ClientSession) {
		this.#session = session;
	}

	get session() {
		return this.#session;
	}

	async insertOne<T extends Document, U = T>(
		Collection: Collection<T, U>,
		doc,
		options?: Options,
	) {
		return Collection.rawCollection().insertOne(
			// TODO skip _id creation if it already exists
			// @ts-expect-error _makeNewID is a private method
			{_id: Collection._makeNewID(), ...doc},
			this._makeOptions(options),
		);
	}

	async insertMany<T extends Document, U = T>(
		Collection: Collection<T, U>,
		docs,
		options?,
	) {
		return Collection.rawCollection().insertMany(
			// TODO skip _id creation if it already exists
			// @ts-expect-error _makeNewID is a private method
			docs.map((doc) => ({_id: Collection._makeNewID(), ...doc})),
			this._makeOptions(options),
		);
	}

	async findOne<T extends Document, U = T>(
		Collection: Collection<T, U>,
		filter,
		options?: Options,
	) {
		return Collection.rawCollection().findOne(
			filter,
			this._makeOptions(options),
		) as Promise<null | T>;
	}

	find<T extends Document, U = T>(
		Collection: Collection<T, U>,
		filter,
		options?,
	) {
		return Collection.rawCollection().find(filter, this._makeOptions(options));
	}

	async fetch<T extends Document, U = T>(
		Collection: Collection<T, U>,
		filter,
		options?,
	) {
		return this.find<T, U>(Collection, filter, options).toArray();
	}

	async deleteOne<T extends Document, U = T>(
		Collection: Collection<T, U>,
		filter,
		options?,
	) {
		return Collection.rawCollection().deleteOne(
			filter,
			this._makeOptions(options),
		);
	}

	async deleteMany<T extends Document, U = T>(
		Collection: Collection<T, U>,
		filter,
		options?,
	) {
		return Collection.rawCollection().deleteMany(
			filter,
			this._makeOptions(options),
		);
	}

	async updateOne<T extends Document, U = T>(
		Collection: Collection<T, U>,
		filter,
		update,
		options?,
	) {
		return Collection.rawCollection().updateOne(
			filter,
			this._makeUpdate<T, U>(Collection, filter, update, options),
			this._makeOptions(options),
		) as unknown as Promise<UpdateResult>;
	}

	async updateMany<T extends Document, U = T>(
		Collection: Collection<T, U>,
		filter,
		update,
		options?,
	) {
		return Collection.rawCollection().updateMany(
			filter,
			this._makeUpdate<T, U>(Collection, filter, update, options),
			this._makeOptions(options),
		) as Promise<UpdateResult>;
	}

	async distinct<T extends Document, U = T>(
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

	private _makeOptions(options?: Options): Options {
		return {session: this.#session, ...options};
	}

	private _makeUpdate<T extends Document, U = T>(
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
