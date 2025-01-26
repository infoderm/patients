import {type ClientSession, type WithId} from 'mongodb';

import type Collection from '../Collection';
import type Document from '../Document';
import type Filter from '../query/Filter';

export type ObjectId = string;

export type ObjectIds = Record<number, ObjectId>;

export type InferIdType<T extends Document> = T extends T ? string : never;

export type UpdateResult<T extends Document> = {
	acknowledged: boolean;
	matchedCount: number;
	modifiedCount: number;
	upsertedCount: number;
	upsertedId?: InferIdType<T>;
};

export type InsertOneResult<T extends Document> = {
	acknowledged: boolean;
	insertedId: InferIdType<T>;
};
export type InsertManyResult<T extends Document> = {
	acknowledged: boolean;
	insertedCount: number;
	insertedIds: Record<number, InferIdType<T>>;
};
export type DeleteResult = {
	acknowledged: boolean;
	deletedCount: number;
};

export type Options = Record<string, any>;
type TransactionDriver = {
	session: ClientSession | null;
	// TODO template depends on Collection document type
	insertOne: <T extends Document, U = T>(
		Collection: Collection<T, U>,
		doc: Omit<T, '_id'>,
		options?: Options,
	) => Promise<InsertOneResult<T>>;
	insertMany: <T extends Document, U = T>(
		Collection: Collection<T, U>,
		docs: Array<Omit<T, '_id'>>,
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
	) => Promise<UpdateResult<T>>;
	updateMany: <T extends Document, U = T>(
		Collection: Collection<T, U>,
		filter: Filter<T>,
		update: any,
		options?: Options,
	) => Promise<UpdateResult<T>>;
	distinct: <T extends Document, U = T>(
		Collection: Collection<T, U>,
		key: string,
		filter?: Filter<T>,
		options?: Options,
	) => Promise<any[]>;
};
export default TransactionDriver;
