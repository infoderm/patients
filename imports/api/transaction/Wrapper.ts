import {ClientSession} from 'mongodb';

import Collection from './Collection';
import Filter from './Filter';

export type ValueOrPromise<X> = X | Promise<X>;

export type IdType = string;

export interface InsertOneResult {
	acknowledged: boolean;
	insertedId: IdType;
}

export type IdTypes = Record<number, IdType>;

export interface InsertManyResult {
	acknowledged: boolean;
	insertedCount: number;
	insertedIds: IdTypes;
}

export interface DeleteResult {
	acknowledged: boolean;
	deletedCount: number;
}

export interface UpdateResult {
	acknowledged: boolean;
	matchedCount: number;
	modifiedCount?: number;
	upsertedCount: number;
	upsertedId?: IdType;
}

export type Options = Record<string, any>;
export default interface Wrapper {
	session: ClientSession;
	// TODO template depends on Collection document type
	insertOne: <T, U = T>(
		Collection: Collection<T, U>,
		doc: any,
		options?: Options,
	) => ValueOrPromise<InsertOneResult>;
	insertMany: <T, U = T>(
		Collection: Collection<T, U>,
		docs: any[],
		options?: Options,
	) => ValueOrPromise<InsertManyResult>;
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
	) => ValueOrPromise<T[]>;
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
