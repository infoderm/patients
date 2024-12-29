import {assert} from 'chai';

import {filter} from '@iterable-iterator/filter';
import {list} from '@iterable-iterator/list';

import {isomorphic} from '../../_test/fixtures';

import type ObserveSequenceChangesCallbacks from '../ObserveSequenceChangesCallbacks';

import {diffSequences} from './diffSequences';

type AddedBeforeCall<K, V> = [
	'addedBefore',
	K,
	K | null,
	Partial<Omit<V, '_id'>>,
];
type MovedBeforeCall<K> = ['movedBefore', K, K | null];
type ChangedCall<K, V> = ['changed', K, Partial<Omit<V, '_id'>>];
type RemovedCall<K> = ['removed', K];

export type Call<K, V> =
	| AddedBeforeCall<K, V>
	| MovedBeforeCall<K>
	| ChangedCall<K, V>
	| RemovedCall<K>;

type MockObserver<K, V> = {
	calls: {
		all: () => Array<Call<K, V>>;
		addedBefore: () => Array<AddedBeforeCall<K, V>>;
		movedBefore: () => Array<MovedBeforeCall<K>>;
		changed: () => Array<ChangedCall<K, V>>;
		removed: () => Array<RemovedCall<K>>;
	};
};

export type MockedDocument = {_id: string; satellite: string};

export const mockedDocument = (
	_id: string,
	satellite: string = _id,
): MockedDocument => ({_id, satellite});

export const makeMockedObserver = <T>(): MockObserver<string, T> &
	ObserveSequenceChangesCallbacks<T> => {
	const _calls: Array<Call<string, T>> = [];
	return {
		calls: {
			all: () => list(_calls),
			addedBefore: () =>
				list(filter(([method]) => method === 'addedBefore', _calls)),
			movedBefore: () =>
				list(filter(([method]) => method === 'movedBefore', _calls)),
			changed: () => list(filter(([method]) => method === 'changed', _calls)),
			removed: () => list(filter(([method]) => method === 'removed', _calls)),
		},
		addedBefore(
			id: string,
			fields: Partial<Omit<T, '_id'>>,
			before: string | null,
		) {
			_calls.push(['addedBefore', id, before, fields]);
		},
		changed(id: string, fields: Partial<Omit<T, '_id'>>) {
			_calls.push(['changed', id, fields]);
		},
		movedBefore(id: string, before: string | null) {
			_calls.push(['movedBefore', id, before]);
		},
		removed(id: string) {
			_calls.push(['removed', id]);
		},
	};
};

isomorphic(__filename, () => {
	it('works with no changes', async () => {
		const mockedObserver = makeMockedObserver<MockedDocument>();
		await diffSequences(
			[mockedDocument('a'), mockedDocument('b')],
			[mockedDocument('a'), mockedDocument('b')],
			mockedObserver,
		);

		assert.deepEqual(mockedObserver.calls.all(), []);
	});

	it('works with only added items', async () => {
		const mockedObserver = makeMockedObserver<MockedDocument>();
		await diffSequences(
			[],
			[mockedDocument('a'), mockedDocument('b')],
			mockedObserver,
		);

		assert.deepEqual(mockedObserver.calls.all(), [
			['addedBefore', 'a', null, {satellite: 'a'}],
			['addedBefore', 'b', null, {satellite: 'b'}],
		]);
	});

	it('works with only removed items', async () => {
		const mockedObserver = makeMockedObserver<MockedDocument>();
		await diffSequences(
			[mockedDocument('a'), mockedDocument('b')],
			[],
			mockedObserver,
		);

		assert.deepEqual(mockedObserver.calls.all(), [
			['removed', 'a'],
			['removed', 'b'],
		]);
	});

	it('works with only changed items', async () => {
		const mockedObserver = makeMockedObserver<MockedDocument>();
		await diffSequences(
			[mockedDocument('a'), mockedDocument('b')],
			[mockedDocument('a', 'A'), mockedDocument('b', 'B')],
			mockedObserver,
		);

		assert.deepEqual(mockedObserver.calls.all(), [
			['changed', 'a', {satellite: 'A'}],
			['changed', 'b', {satellite: 'B'}],
		]);
	});

	it('works with only moved items', async () => {
		const mockedObserver = makeMockedObserver<MockedDocument>();
		await diffSequences(
			[mockedDocument('a'), mockedDocument('b')],
			[mockedDocument('b'), mockedDocument('a')],
			mockedObserver,
		);

		assert.deepEqual(mockedObserver.calls.all(), [['movedBefore', 'b', 'a']]);
	});

	it('works with projection function', async () => {
		const mockedObserver = makeMockedObserver<MockedDocument>();
		await diffSequences(
			[mockedDocument('a'), mockedDocument('b')],
			[mockedDocument('a', 'A'), mockedDocument('b', 'B')],
			mockedObserver,
			() => ({}),
		);

		assert.deepEqual(mockedObserver.calls.all(), []);
	});

	it('works in complex case (1)', async () => {
		const mockedObserver = makeMockedObserver<MockedDocument>();
		await diffSequences(
			[mockedDocument('a'), mockedDocument('b'), mockedDocument('c')],
			[mockedDocument('c'), mockedDocument('b', 'x'), mockedDocument('d')],
			mockedObserver,
			({satellite}) => ({satellite: satellite.toUpperCase()}),
		);

		assert.deepEqual(mockedObserver.calls.all(), [
			['removed', 'a'],
			['movedBefore', 'c', 'b'],
			['changed', 'b', {satellite: 'X'}],
			['addedBefore', 'd', null, {satellite: 'D'}],
		]);
	});

	it('works in complex case (2)', async () => {
		const mockedObserver = makeMockedObserver<MockedDocument>();
		await diffSequences(
			[mockedDocument('a'), mockedDocument('b'), mockedDocument('c')],
			[mockedDocument('c'), mockedDocument('d'), mockedDocument('b', 'x')],
			mockedObserver,
			({satellite}) => ({satellite: satellite.toUpperCase()}),
		);

		assert.deepEqual(mockedObserver.calls.all(), [
			['removed', 'a'],
			['movedBefore', 'c', 'b'],
			['addedBefore', 'd', 'b', {satellite: 'D'}],
			['changed', 'b', {satellite: 'X'}],
		]);
	});
});
