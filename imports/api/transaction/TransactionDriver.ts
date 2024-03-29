import {
	type ClientSession,
	type UpdateResult as MongoUpdateResult,
	type InsertOneResult as MongoInsertOneResult,
	type InsertManyResult as MongoInsertManyResult,
	type DeleteResult as MongoDeleteResult,
	type WithId,
} from 'mongodb';

import type Collection from '../Collection';
import type Document from '../Document';
import type Filter from '../query/Filter';

export type ObjectId = string;

export type ObjectIds = Record<number, ObjectId>;

export type UpdateResult = Omit<MongoUpdateResult, 'upsertedId'> & {
	upsertedId?: ObjectId;
};

export type InsertOneResult<T> = MongoInsertOneResult<T>;
export type InsertManyResult<T> = MongoInsertManyResult<T>;
export type DeleteResult = MongoDeleteResult;

export type Options = Record<string, any>;
type TransactionDriver = {
	session: ClientSession | null;
	// TODO template depends on Collection document type
	insertOne: <T extends Document, U = T>(
		Collection: Collection<T, U>,
		doc: any,
		options?: Options,
	) => Promise<InsertOneResult<T>>;
	insertMany: <T extends Document, U = T>(
		Collection: Collection<T, U>,
		docs: any[],
		options?: Options,
	) => Promise<InsertManyResult<T>>;
	findOne: <T extends Document, U = T>(
		Collection: Collection<T, U>,
		filter: Filter<T>,
		options?: Options,
	) => Promise<null | T>;
	find: <T extends Document, U = T>(
		Collection: Collection<T, U>,
		filter: Filter<T>,
		options?: Options,
	) => any; // TODO cursor type
	fetch: <T extends Document, U = T>(
		Collection: Collection<T, U>,
		filter: Filter<T>,
		options?: Options,
	) => Promise<Array<WithId<T>>>;
	deleteOne: <T extends Document, U = T>(
		Collection: Collection<T, U>,
		filter: Filter<T>,
		options?: Options,
	) => Promise<DeleteResult>;
	deleteMany: <T extends Document, U = T>(
		Collection: Collection<T, U>,
		filter: Filter<T>,
		options?: Options,
	) => Promise<DeleteResult>;
	updateOne: <T extends Document, U = T>(
		Collection: Collection<T, U>,
		filter: Filter<T>,
		update: any,
		options?: Options,
	) => Promise<UpdateResult>;
	updateMany: <T extends Document, U = T>(
		Collection: Collection<T, U>,
		filter: Filter<T>,
		update: any,
		options?: Options,
	) => Promise<UpdateResult>;
	distinct: <T extends Document, U = T>(
		Collection: Collection<T, U>,
		key: string,
		filter?: Filter<T>,
		options?: Options,
	) => Promise<any[]>;
};
export default TransactionDriver;
