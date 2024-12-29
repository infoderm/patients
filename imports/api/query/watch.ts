import assert from 'assert';

import {type Filter as MongoFilter} from 'mongodb';

import {
	type ClientSessionOptions,
	type ChangeStream,
	type ChangeStreamOptions,
	type Timestamp,
} from 'mongodb';

import debounce from 'debounce';

import {isObject} from '@functional-abstraction/type';

import type Collection from '../Collection';
import type Document from '../Document';

import {type Options} from '../transaction/TransactionDriver';
import withSession from '../transaction/withSession';

import {EventEmitter, eventEmitter} from '../../lib/events';

import {AsyncQueue} from '../../lib/async/queue';

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

type Match = {
	$match: {};
};

type Pipeline = {
	pipeline: Match[];
	isSuperset: boolean;
};

const _fullDocumentMissingFilter = {fullDocument: undefined};
const _fullDocumentBeforeChangeMissingFilter = {
	fullDocumentBeforeChange: undefined,
};

const _filterToMatch = <T>(filter: Filter<T>): Match => ({
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

const _filterToPipeline = <T>({$text, ...rest}: Filter<T>): Pipeline => {
	return {
		pipeline: [_filterToMatch(rest as Filter<T>)],
		// TODO Any occurrence of $text should yield this, not just top-level.
		isSuperset: $text !== undefined,
	};
};

const _noFullDocumentMatch = (): Match => ({
	$match: {
		// NOTE This matches everything if pre- or post- images are not
		// configured, which is very inefficient.
		$or: [_fullDocumentMissingFilter, _fullDocumentBeforeChangeMissingFilter],
	},
});

// @ts-expect-error TODO
const _noFullDocumentPipeline = (): Pipeline => {
	return {
		pipeline: [_noFullDocumentMatch()],
		isSuperset: true,
	};
};

const _optionsToPipeline = (options: Options) =>
	options.project === undefined ? [] : [{$project: options.project}];

let _watchStreamCount = 0;

export const getWatchStreamCount = () => _watchStreamCount;

const _watchStream = <T extends Document, U = T>(
	collection: Collection<T, U>,
	filterPipeline: Match[],
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

	const rawCollection = collection.rawCollection();

	const stream = rawCollection.watch(pipeline, {
		startAtOperationTime,
		fullDocument: 'whenAvailable',
		fullDocumentBeforeChange: 'whenAvailable',
		...changeStreamOptions,
	});

	let open = true;
	++_watchStreamCount;
	console.debug({_watchStreamCount});
	stream.on('close', () => {
		if (open) {
			open = false;
			--_watchStreamCount;
			console.debug({_watchStreamCount});
		}
	});

	return _groupFragments(stream);
};

const _groupFragments = <T extends Document>(stream: ChangeStream<T>) => {
	const emitter = eventEmitter<{entry: ChangeStreamEvent; close: undefined}>();

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

		const {splitEvent, ...rest} = event;

		emitter.emitSerial('entry', rest).catch((error: unknown) => {
			console.error({error});
		});
	});

	emitter
		.once('close')
		.then(async () => stream.close())
		.catch((error: unknown) => {
			console.error({error});
		});

	return emitter;
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

	// TODO: Watch multiple streams concurrently, and recycle them.
	// const unfilteredStream = _watchStream(
	// collection,
	// _noFullDocumentPipeline(),
	// options,
	// operationTime,
	// changeStreamOptions,
	// );

	return {init, stream: filteredStream, filterIsSuperset};
};

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
	splitEvent?: undefined;
};

export type FilteredOplogHandle = EventEmitter<{
	entry: ChangeStreamEvent;
	close: undefined;
}>;

export type WatchHandle<T> = EventEmitter<{
	change: T[];
	start: undefined;
	stop?: Error;
}>;

class Watch<T extends Document, U = T> extends EventEmitter<T> {
	collection: Collection<T, U>;
	filter: Filter<T>;
	options: Options;
	changeStreamOptions?: ChangeStreamOptions;
	sessionOptions?: ClientSessionOptions;

	constructor(collection, filter, options, sessionOptions) {
		super();
		this.collection = collection;
		this.filter = filter;
		this.options = options;
		this.sessionOptions = sessionOptions;
	}

	get init() {
		return [];
	}

	stop() {
		// TODO: ???
	}
}

const PIPE_DEBOUNCE = 50;

const _pipe = async <T extends Document, U = T>(
	handle: WatchHandle<T>,
	emitter: FilteredOplogHandle,
	w: Watch<T, U>,
) => {
	const queue = new AsyncQueue();

	const onEntry = debounce(() => {
		if (queue.length > 0) return;
		queue.enqueue(async () => {
			const {init} = await _watchInit(
				w.collection,
				w.filter,
				w.options,
				w.sessionOptions,
			);

			await handle.emitSerial('change', init);
		});
	}, PIPE_DEBOUNCE);

	emitter.on('entry', onEntry);

	// TODO: stream.on('stop', ???)
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

	await handle.emitSerial('change', init);

	const w = new Watch<T>(collection, filter, options, sessionOptions);
	await _pipe<T>(handle, stream, w);

	const stop = async () => stream.emitSerial('close');

	return stop;
};

const watch = async <T extends Document, U = T>(
	collection: Collection<T, U>,
	filter: Filter<T>,
	options: Options,
	changeStreamOptions?: ChangeStreamOptions,
	sessionOptions?: ClientSessionOptions,
) => {
	const handle: WatchHandle<T> = eventEmitter();

	let stopped = false;

	handle
		.once('stop')
		.then(() => {
			stopped = true;
		})
		.catch((error: unknown) => {
			console.error({error});
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
		else
			handle
				.once('stop')
				.then(stop)
				.catch((error: unknown) => {
					console.error({error});
				});
	});

	return handle;
};

export default watch;
