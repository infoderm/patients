import assert from 'assert';

import {type Filter as MongoFilter} from 'mongodb';

import {
	type ClientSessionOptions,
	type ChangeStreamOptions,
	type Timestamp,
} from 'mongodb';

import {isObject} from '@functional-abstraction/type';

import type Collection from '../Collection';
import type Document from '../Document';

import {type Options} from '../transaction/TransactionDriver';
import withSession from '../transaction/withSession';

import {type EventEmitter, eventEmitter} from '../../lib/events';

import type Filter from './Filter';

const _watchInit = async <T extends Document, U = T>(
	collection: Collection<T, U>,
	filter: Filter<T>,
	options: Options,
	sessionOptions?: ClientSessionOptions,
) =>
	withSession(async (session) => {
		// TODO Reuse session for subsequent polling, see:
		// https://www.mongodb.com/docs/manual/core/read-isolation-consistency-recency/#std-label-causal-consistency-examples
		// https://vkontech.com/causal-consistency-guarantees-in-mongodb-lamport-clock-cluster-time-operation-time-and-causally-consistent-sessions/
		// I guess one should use advanceClusterTime using the clusterTime
		// returned by the last change stream event
		const init = await collection
			.rawCollection()
			.find(filter as MongoFilter<T>, {...options, session})
			.toArray();
		const {operationTime} = session;
		assert(operationTime !== undefined, 'operationTime is undefined');
		return {init, operationTime};
	}, sessionOptions);

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

const _fullDocumentMissingFilter = {fullDocument: undefined};
const _fullDocumentBeforeChangeMissingFilter = {
	fullDocumentBeforeChange: undefined,
};

const _filterToMatch = <T>(filter: Filter<T>) => ({
	$match: {
		$or: [
			// TODO Correctly configure collections to define fullDocument*
			// Currently not possible because this requires top-level await
			// Should be doable in Meteor 3.0
			// SEE
			// https://www.mongodb.com/docs/manual/reference/command/collMod/#std-label-collMod-change-stream-pre-and-post-images
			_filterToFullDocumentFilter('fullDocument', filter),
			_filterToFullDocumentFilter('fullDocumentBeforeChange', filter),
			_fullDocumentMissingFilter,
			_fullDocumentBeforeChangeMissingFilter,
		],
	},
});

const _filterToPipeline = <T>({$text, ...rest}: Filter<T>) => {
	return {
		pipeline: [_filterToMatch(rest as Filter<T>)],
		// TODO Any occurrence of $text should yield this, not just top-level.
		isSuperset: $text !== undefined,
	};
};

const _noFullDocumentMatch = () => ({
	$match: {
		// NOTE This matches everything if pre- or post- images are not
		// configured, which is very inefficient.
		$or: [_fullDocumentMissingFilter, _fullDocumentBeforeChangeMissingFilter],
	},
});

const _noFullDocumentPipeline = () => {
	return {
		pipeline: [_noFullDocumentMatch()],
		isSuperset: true,
	};
};

const _optionsToPipeline = (options: Options) =>
	options.project === undefined ? [] : [{$project: options.project}];

const _watchStream = <T extends Document, U = T>(
	collection: Collection<T, U>,
	filterPipeline,
	options: Options,
	startAtOperationTime: Timestamp,
	changeStreamOptions?: ChangeStreamOptions,
) => {
	const pipeline = [
		...filterPipeline,
		{$match: {clusterTime: {$gt: startAtOperationTime}}},
		..._optionsToPipeline(options),
		// SEE
		// https://www.mongodb.com/docs/manual/reference/operator/aggregation/changeStreamSplitLargeEvent/
		{$changeStreamSplitLargeEvent: {}},
	];

	return collection.rawCollection().watch(pipeline, {
		startAtOperationTime,
		fullDocument: 'whenAvailable',
		fullDocumentBeforeChange: 'whenAvailable',
		...changeStreamOptions,
	});
};

const _watchSetup = async <T extends Document, U = T>(
	collection: Collection<T, U>,
	filter: Filter<T>,
	options: Options,
	changeStreamOptions?: ChangeStreamOptions,
	sessionOptions?: ClientSessionOptions,
) => {
	const {init, operationTime} = await _watchInit(
		collection,
		filter,
		options,
		sessionOptions,
	);

	const {pipeline: filterPipeline, isSuperset: filterIsSuperset} =
		_filterToPipeline(filter);

	const filteredStream = _watchStream(
		collection,
		filterPipeline,
		options,
		operationTime,
		changeStreamOptions,
	);

	// const unfilteredStream = _watchStream(
	// collection,
	// _noFullDocumentPipeline(),
	// options,
	// operationTime,
	// changeStreamOptions,
	// );

	return {init, stream: filteredStream, filterIsSuperset};
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

type Fragment = {
	_id: {
		_data: string;
	};
	splitEvent: {
		fragment: number;
		of: number;
	};
};

type ChangeStreamEvent = {
	_id: {
		_data: string;
	};
	splitEvent: undefined;
};

const _watch = async <T extends Document, U = T>(
	handle: WatchHandle<T>,
	collection: Collection<T, U>,
	filter: Filter<T>,
	options: Options,
	changeStreamOptions?: ChangeStreamOptions,
	sessionOptions?: ClientSessionOptions,
) => {
	const {init, stream} = await _watchSetup(
		collection,
		filter,
		options,
		changeStreamOptions,
		sessionOptions,
	);

	const enqueue = await _makeQueue();

	await handle.emitSerial('change', init);

	let event: Fragment = {
		_id: {
			_data: '',
		},
		splitEvent: {
			fragment: 1,
			of: 1,
		},
	};

	stream.on('change', (fragment: ChangeStreamEvent | Fragment) => {
		if (fragment.splitEvent === undefined) {
			assert(fragment._id._data !== event._id._data);
			assert(event.splitEvent.fragment === event.splitEvent.of);
			event = {...fragment, splitEvent: {fragment: 1, of: 1}};
		} else if (fragment.splitEvent.fragment === 1) {
			assert(fragment._id._data !== event._id._data);
			assert(event.splitEvent.fragment === event.splitEvent.of);
			assert(fragment.splitEvent.fragment === 1);
			event = fragment;
		} else {
			assert(fragment._id._data === event._id._data);
			assert(fragment.splitEvent.fragment === event.splitEvent.fragment + 1);
			assert(fragment.splitEvent.of === event.splitEvent.of);
			assert(fragment.splitEvent.fragment <= fragment.splitEvent.of);
			event = {...event, ...fragment};
		}

		if (event.splitEvent.fragment !== event.splitEvent.of) return;

		enqueue(async () => {
			const {init} = await _watchInit(
				collection,
				filter,
				options,
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
			sessionOptions,
		);
		if (stopped) await stop();
		else void handle.once('stop').then(stop);
	});

	return handle;
};

export default watch;
