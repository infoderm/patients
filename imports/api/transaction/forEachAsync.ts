import {type WithId} from 'mongodb';
import snapshotTransaction from './snapshotTransaction';
import type MongoTransactionExecutionDriver from './MongoTransactionExecutionDriver';
import type Collection from './Collection';
import type Filter from './Filter';

type ForEachAsyncCallback<T> = (
	db: MongoTransactionExecutionDriver,
	item: T,
) => Promise<any>;

const forEachAsync = async <T, U = T>(
	collection: Collection<T, U>,
	filter: Filter<T>,
	fn: ForEachAsyncCallback<WithId<T>>,
) =>
	snapshotTransaction(async (db) => {
		const label = `forEachAsync-${
			collection.rawCollection().collectionName
		}-${JSON.stringify(filter)}`;
		console.time(label);
		const cursor = db.find(collection, filter).hint({$natural: 1});
		for (;;) {
			// eslint-disable-next-line no-await-in-loop
			const item = await cursor.next();
			if (item === null) break;
			// eslint-disable-next-line no-await-in-loop
			await fn(db, item);
		}

		console.timeEnd(label);
	});

export default forEachAsync;
