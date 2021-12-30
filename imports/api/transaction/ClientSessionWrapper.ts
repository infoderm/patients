import {ClientSession} from 'mongodb';

export default class ClientSessionWrapper {
	readonly #session: ClientSession;
	#insertOne: Function = null;
	#findOne: Function = null;
	#updateOne: Function = null;
	#replaceOne: Function = null;
	#deleteOne: Function = null;
	#find: Function = null;

	constructor(session: ClientSession) {
		this.#session = session;
	}

	private _makeOptions(options) {
		return {session: this.#session, ...options};
	}

	get session() {
		return this.#session;
	}

	get insertOne() {
		if (this.#insertOne === null) {
			this.#insertOne = async (Collection, doc, options) => {
				// TODO skip _id creation if it already exists
				const _id = Collection._makeNewID();
				return Collection.rawCollection().insertOne(
					{_id, ...doc},
					this._makeOptions(options),
				);
			};
		}

		return this.#insertOne;
	}

	get findOne() {
		if (this.#findOne === null) {
			this.#findOne = async (Collection, filter, options) => {
				return Collection.rawCollection().findOne(
					filter,
					this._makeOptions(options),
				);
			};
		}

		return this.#findOne;
	}

	get deleteOne() {
		if (this.#deleteOne === null) {
			this.#deleteOne = async (Collection, filter, options) => {
				return Collection.rawCollection().deleteOne(
					filter,
					this._makeOptions(options),
				);
			};
		}

		return this.#deleteOne;
	}

	get updateOne() {
		if (this.#updateOne === null) {
			this.#updateOne = async (Collection, filter, update, options) => {
				return Collection.rawCollection().updateOne(
					filter,
					update,
					this._makeOptions(options),
				);
			};
		}

		return this.#updateOne;
	}

	get replaceOne() {
		if (this.#replaceOne === null) {
			this.#replaceOne = async (Collection, filter, replacement, options) => {
				return Collection.rawCollection().replaceOne(
					filter,
					replacement,
					this._makeOptions(options),
				);
			};
		}

		return this.#replaceOne;
	}

	get find() {
		if (this.#find === null) {
			this.#find = async (Collection, filter, options) => {
				return Collection.rawCollection().find(
					filter,
					this._makeOptions(options),
				);
			};
		}

		return this.#find;
	}
}
