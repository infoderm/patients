import assert from 'assert';

import {
	type ChangeStreamDocument,
	type ClientSessionOptions,
	type TransactionOptions,
	type ChangeStreamOptions,
} from 'mongodb';

import type Document from './Document';

import {type Options} from './transaction/TransactionDriver';

import type Filter from './query/Filter';
import type Collection from './Collection';
import withSession from './transaction/withSession';
import withTransactionDriver from './transaction/withTransactionDriver';

const _watchInit = async <T extends Document, U = T>(
	collection: Collection<T, U>,
	filter: Filter<T>,
	options: Options,
	transactionOptions?: TransactionOptions,
	sessionOptions?: ClientSessionOptions,
) =>
	withSession(
		async (session) =>
			withTransactionDriver(
				session,
				async (driver) => {
					const init = await driver.fetch(collection, filter, options);
					const {operationTime} = session;
					assert(operationTime !== undefined);
					return {init, operationTime};
				},
				transactionOptions,
			),
		sessionOptions,
	);

const _filterToMatch = <T>(filter: Filter<T>) => {
	return Object.fromEntries(
		Object.entries(filter).map(([key, value]) => [
			`fulldocument.${key}`,
			value,
		]),
	);
};

const _watchStream = <T extends Document, U = T>(
	collection: Collection<T, U>,
	filter: Filter<T>,
	options: Options,
	startAtOperationTime: any, // TODO
	changeStreamOptions?: ChangeStreamOptions,
) =>
	collection
		.rawCollection()
		.watch([{$match: _filterToMatch(filter)}, {$project: options.project}], {
			startAtOperationTime,
			...changeStreamOptions,
		});

const _watchSetup = async <T extends Document, U = T>(
	collection: Collection<T, U>,
	filter: Filter<T>,
	options: Options,
	changeStreamOptions?: ChangeStreamOptions,
	transactionOptions?: TransactionOptions,
	sessionOptions?: ClientSessionOptions,
) => {
	const {init, operationTime} = await _watchInit(
		collection,
		filter,
		options,
		transactionOptions,
		sessionOptions,
	);

	const stream = _watchStream(
		collection,
		filter,
		options,
		operationTime,
		changeStreamOptions,
	);

	return {init, stream};
};

type OnChange<T extends Document> = (doc: ChangeStreamDocument<T>) => void;

const watch = async <T extends Document, U = T>(
	collection: Collection<T, U>,
	filter: Filter<T>,
	options: Options,
	onChange: OnChange<T>,
	changeStreamOptions?: ChangeStreamOptions,
	transactionOptions?: TransactionOptions,
	sessionOptions?: ClientSessionOptions,
) => {
	const {init, stream} = await _watchSetup(
		collection,
		filter,
		options,
		changeStreamOptions,
		transactionOptions,
		sessionOptions,
	);

	stream.on('change', onChange);

	const stop = async () => stream.close();

	return {init, stop};
};

export default watch;
