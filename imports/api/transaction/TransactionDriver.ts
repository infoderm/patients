import {
	ClientSession,
	UpdateResult as MongoUpdateResult,
	InsertOneResult as MongoInsertOneResult,
	InsertManyResult as MongoInsertManyResult,
	DeleteResult as MongoDeleteResult,
	WithId,
} from 'mongodb';

import Collection from './Collection';
import Filter from './Filter';

export type ValueOrPromise<X> = X | Promise<X>;

export type ObjectId = string;

export type ObjectIds = Record<number, ObjectId>;

export type UpdateResult = Omit<MongoUpdateResult, 'upsertedId'> & {
	upsertedId?: ObjectId;
};

export type InsertOneResult<T> = MongoInsertOneResult<T>;
export type InsertManyResult<T> = MongoInsertManyResult<T>;
export type DeleteResult = MongoDeleteResult;

export type Options = Record<string, any>;
export default interface TransactionDriver {
	session: ClientSession;
	// TODO template depends on Collection document type
	insertOne: <T, U = T>(
		Collection: Collection<T, U>,
		doc: any,
		options?: Options,
	) => ValueOrPromise<InsertOneResult<T>>;
	insertMany: <T, U = T>(
		Collection: Collection<T, U>,
		docs: any[],
		options?: Options,
	) => ValueOrPromise<InsertManyResult<T>>;
	findOne: <T, U = T>(
		Collection: Collection<T, U>,
		filter: Filter<T>,
		options?: Options,
	) => ValueOrPromise<null | T>;
	find: <T, U = T>(
		Collection: Collection<T, U>,
		filter: Filter<T>,
		options?: Options,
	) => any; // TODO cursor type
	fetch: <T, U = T>(
		Collection: Collection<T, U>,
		filter: Filter<T>,
		options?: Options,
	) => ValueOrPromise<Array<WithId<T>>>;
	deleteOne: <T, U = T>(
		Collection: Collection<T, U>,
		filter: Filter<T>,
		options?: Options,
	) => ValueOrPromise<DeleteResult>;
	deleteMany: <T, U = T>(
		Collection: Collection<T, U>,
		filter: Filter<T>,
		options?: Options,
	) => ValueOrPromise<DeleteResult>;
	updateOne: <T, U = T>(
		Collection: Collection<T, U>,
		filter: Filter<T>,
		update: any,
		options?: Options,
	) => ValueOrPromise<UpdateResult>;
	updateMany: <T, U = T>(
		Collection: Collection<T, U>,
		filter: Filter<T>,
		update: any,
		options?: Options,
	) => ValueOrPromise<UpdateResult>;
	distinct: <T, U = T>(
		Collection: Collection<T, U>,
		key: string,
		filter?: Filter<T>,
		options?: Options,
	) => ValueOrPromise<any[]>;
}
