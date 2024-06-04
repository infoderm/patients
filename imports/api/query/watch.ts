import assert from 'assert';

import {
	type ClientSessionOptions,
	type TransactionOptions,
	type ChangeStreamOptions,
	type Timestamp,
} from 'mongodb';

import {isObject} from '@functional-abstraction/type';

import type Collection from '../Collection';
import type Document from '../Document';

import {type Options} from '../transaction/TransactionDriver';
import withSession from '../transaction/withSession';
import withTransactionDriver from '../transaction/withTransactionDriver';

import type Filter from './Filter';

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

const _filterToFullDocumentFilter = <T>(filter: Filter<T>) =>
	Object.fromEntries(
		Object.entries(filter).map(([key, value]) => [
			key.startsWith('$') ? key : `fullDocument.${key}`,
			isObject(value) ? _filterToFullDocumentFilter(value as Filter<T>) : value,
		]),
	);

const _filterToMatch = <T>(filter: Filter<T>) => ({
	$match: {
		$and: _filterToFullDocumentFilter(filter),
	},
});

const _filterToPipeline = <T>({$text, ...rest}: Filter<T>) => {
	return {
		pipeline: [_filterToMatch(rest as Filter<T>)].filter(Boolean),
		// TODO Any occurrence of $text should yield this, not just top-level.
		isSuperset: $text !== undefined,
	};
};

const _optionsToPipeline = (options: Options) => [{$project: options.project}];

const _watchStream = <T extends Document, U = T>(
	collection: Collection<T, U>,
	filter: Filter<T>,
	options: Options,
	startAtOperationTime: Timestamp,
	changeStreamOptions?: ChangeStreamOptions,
) => {
	const {pipeline: filterPipeline, isSuperset: filterIsSuperset} =
		_filterToPipeline(filter);

	const pipeline = [...filterPipeline, ..._optionsToPipeline(options)];
	const stream = collection.rawCollection().watch(pipeline, {
		startAtOperationTime,
		fullDocument: 'whenAvailable',
		fullDocumentBeforeChange: 'whenAvailable',
		...changeStreamOptions,
	});

	return {
		stream,
		isSuperset: filterIsSuperset,
	};
};

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

	const {stream, isSuperset: streamIsSuperset} = _watchStream(
		collection,
		filter,
		options,
		operationTime,
		changeStreamOptions,
	);

	return {init, stream, streamIsSuperset};
};

type OnChange<T extends Document> = (result: T[]) => Promise<void>;

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

	let queued = 0;
	const queue = new Promise((resolve) => {
		resolve(undefined);
	});
	const enqueue = (task) => {
		// TODO Throttle.
		if (queued === 0) return;
		++queued;
		queue.then(
			() => {
				--queued;
				return task();
			},
			(error) => {
				console.error({error});
			},
		);
	};

	stream.on('change', () => {
		enqueue(async () => {
			const {init} = await _watchInit(
				collection,
				filter,
				options,
				transactionOptions,
				sessionOptions,
			);

			await onChange(init);
		});
	});

	// TODO stream.on('stop', ???)

	const stop = async () => stream.close();

	return {init, stop};
};

export default watch;
