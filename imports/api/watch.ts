import assert from 'assert';

import {
	type ChangeStreamDocument,
	type ClientSessionOptions,
	type TransactionOptions,
	type ChangeStreamOptions,
	type Timestamp,
} from 'mongodb';

import {isObject} from '@functional-abstraction/type';

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

const _filterToMatch = <T>(filter: Filter<T>) =>
	Object.fromEntries(
		Object.entries(filter).map(([key, value]) => [
			key.startsWith('$') ? key : `fullDocument.${key}`,
			isObject(value) ? _filterToMatch(value as Filter<T>) : value,
		]),
	);

const _filterToPipeline = <T>({$text, ...rest}: Filter<T>) =>
	[
		$text === undefined ? null : {$match: {$text}},
		_filterToMatch(rest as Filter<T>),
	].filter(Boolean);

const _optionsToPipeline = (options: Options) => [{$project: options.project}];

const _watchStream = <T extends Document, U = T>(
	collection: Collection<T, U>,
	filter: Filter<T>,
	options: Options,
	startAtOperationTime: Timestamp,
	changeStreamOptions?: ChangeStreamOptions,
) =>
	collection
		.rawCollection()
		.watch([..._filterToPipeline(filter), ..._optionsToPipeline(options)], {
			startAtOperationTime,
			fullDocument: 'whenAvailable',
			fullDocumentBeforeChange: 'whenAvailable',
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
