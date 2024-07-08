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

import {type EventEmitter, eventEmitter} from '../../lib/events';

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

const _filterToFullDocumentFilter = <T>(
	operationKey: string,
	filter: Filter<T>,
) =>
	Object.fromEntries(
		Object.entries(filter).map(([key, value]) => [
			key.startsWith('$') ? key : `${operationKey}.${key}`,
			isObject(value)
				? _filterToFullDocumentFilter(operationKey, value as Filter<T>)
				: value,
		]),
	);

const _filterToMatch = <T>(filter: Filter<T>) => ({
	$match: {
		$or: [
			_filterToFullDocumentFilter('fullDocument', filter),
			_filterToFullDocumentFilter('fullDocumentBeforeChange', filter),
			{
				$and: [
					{fullDocument: undefined},
					{fullDocumentBeforeChange: undefined},
				],
			},
		],
	},
});

const _filterToPipeline = <T>({$text, ...rest}: Filter<T>) => {
	return {
		pipeline: [_filterToMatch(rest as Filter<T>)].filter(Boolean),
		// TODO Any occurrence of $text should yield this, not just top-level.
		isSuperset: $text !== undefined,
	};
};

const _optionsToPipeline = (options: Options) =>
	options.project === undefined ? [] : [{$project: options.project}];

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

const _makeQueue = async () => {
	let queued = 0;
	let queue = new Promise((resolve) => {
		resolve(undefined);
	});
	await queue;

	const enqueue = (task: () => Promise<void> | void) => {
		// TODO Throttle.
		if (queued !== 0) return;
		++queued;
		queue = queue
			.then(async () => {
				--queued;
				return task();
			})
			.catch((error) => {
				console.error({error});
			});
	};

	return enqueue;
};

export type WatchHandle<T> = EventEmitter<{
	change: T[];
	start: undefined;
	stop: undefined;
}>;

const _watch = async <T extends Document, U = T>(
	handle: WatchHandle<T>,
	collection: Collection<T, U>,
	filter: Filter<T>,
	options: Options,
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

	const enqueue = await _makeQueue();

	await handle.emitSerial('change', init);

	stream.on('change', () => {
		enqueue(async () => {
			const {init} = await _watchInit(
				collection,
				filter,
				options,
				transactionOptions,
				sessionOptions,
			);

			await handle.emitSerial('change', init);
		});
	});

	// TODO stream.on('stop', ???)
	const stop = async () => stream.close();

	return stop;
};

const watch = async <T extends Document, U = T>(
	collection: Collection<T, U>,
	filter: Filter<T>,
	options: Options,
	changeStreamOptions?: ChangeStreamOptions,
	transactionOptions?: TransactionOptions,
	sessionOptions?: ClientSessionOptions,
) => {
	const handle = eventEmitter<{
		change: T[];
		start: undefined;
		stop: undefined;
	}>();

	let stopped = false;

	void handle.once('stop').then(() => {
		stopped = true;
	});

	handle.on('start', async () => {
		if (stopped) return;
		const stop = await _watch<T, U>(
			handle,
			collection,
			filter,
			options,
			changeStreamOptions,
			transactionOptions,
			sessionOptions,
		);
		if (stopped) await stop();
		else void handle.once('stop').then(stop);
	});

	return handle;
};

export default watch;
