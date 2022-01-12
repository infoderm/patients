import Wrapper from './Wrapper';
import Collection from './Collection';

export default class MinimongoWrapper implements Wrapper {
	get session() {
		return null;
	}

	insertOne<T, U = T>(Collection: Collection<T, U>, doc, options?) {
		return {
			acknowledged: true,
			insertedId: Collection.insert(doc, this._makeOptions(options)),
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
			return {
				acknowledged: true,
				matchedCount: numberAffected,
				modifiedCount: numberAffected,
				upsertedCount: insertedId ? 1 : 0,
				upsertedId: insertedId,
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
			return {
				acknowledged: true,
				matchedCount: numberAffected,
				modifiedCount: numberAffected,
				upsertedCount: insertedId ? 1 : 0,
				upsertedId: insertedId,
			};
		}

		const numberAffected = Collection.update(
			filter,
			update,
			this._makeOptions({multi: true, ...rest}),
		);

		return {
			acknowledged: true,
			matchedCount: numberAffected,
			modifiedCount: numberAffected,
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
