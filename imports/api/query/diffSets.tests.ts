import {assert} from 'chai';

import {filter} from '@iterable-iterator/filter';
import {list} from '@iterable-iterator/list';

import {isomorphic} from '../../_test/fixtures';

import type ObserveSetChangesCallbacks from '../ObserveSetChangesCallbacks';

import {diffSets} from './diffSets';

type AddedCall<K, V> = ['added', K, Partial<Omit<V, '_id'>>];
type ChangedCall<K, V> = ['changed', K, Partial<Omit<V, '_id'>>];
type RemovedCall<K> = ['removed', K];

export type Call<K, V> = AddedCall<K, V> | ChangedCall<K, V> | RemovedCall<K>;

type MockObserver<K, V> = {
	calls: {
		all: () => Array<Call<K, V>>;
		added: () => Array<AddedCall<K, V>>;
		changed: () => Array<ChangedCall<K, V>>;
		removed: () => Array<RemovedCall<K>>;
	};
};

export type MockedDocument = {_id: string; satellite: string};

export const mockedDocument = (
	_id: string,
	satellite: string = _id,
): [string, MockedDocument] => [_id, {_id, satellite}];

export const makeMockedObserver = <T>(): MockObserver<string, T> &
	ObserveSetChangesCallbacks<T> => {
	const _calls: Array<Call<string, T>> = [];
	return {
		calls: {
			all: () => list(_calls),
			added: () => list(filter(([method]) => method === 'addedBefore', _calls)),
			changed: () => list(filter(([method]) => method === 'changed', _calls)),
			removed: () => list(filter(([method]) => method === 'removed', _calls)),
		},
		added(id: string, fields: Partial<Omit<T, '_id'>>) {
			_calls.push(['added', id, fields]);
		},
		changed(id: string, fields: Partial<Omit<T, '_id'>>) {
			_calls.push(['changed', id, fields]);
		},
		removed(id: string) {
			_calls.push(['removed', id]);
		},
	};
};

isomorphic(__filename, () => {
	it('works with no changes', async () => {
		const mockedObserver = makeMockedObserver<MockedDocument>();
		await diffSets(
			new Map([mockedDocument('a'), mockedDocument('b')]),
			new Map([mockedDocument('a'), mockedDocument('b')]),
			mockedObserver,
		);

		assert.deepEqual(mockedObserver.calls.all(), []);
	});

	it('works with only added items', async () => {
		const mockedObserver = makeMockedObserver<MockedDocument>();
		await diffSets(
			new Map(),
			new Map([mockedDocument('a'), mockedDocument('b')]),
			mockedObserver,
		);

		assert.deepEqual(mockedObserver.calls.all(), [
			['added', 'a', {satellite: 'a'}],
			['added', 'b', {satellite: 'b'}],
		]);
	});

	it('works with only removed items', async () => {
		const mockedObserver = makeMockedObserver<MockedDocument>();
		await diffSets(
			new Map([mockedDocument('a'), mockedDocument('b')]),
			new Map([]),
			mockedObserver,
		);

		assert.deepEqual(mockedObserver.calls.all(), [
			['removed', 'a'],
			['removed', 'b'],
		]);
	});

	it('works with only changed items', async () => {
		const mockedObserver = makeMockedObserver<MockedDocument>();
		await diffSets(
			new Map([mockedDocument('a'), mockedDocument('b')]),
			new Map([mockedDocument('a', 'A'), mockedDocument('b', 'B')]),
			mockedObserver,
		);

		assert.deepEqual(mockedObserver.calls.all(), [
			['changed', 'a', {satellite: 'A'}],
			['changed', 'b', {satellite: 'B'}],
		]);
	});

	it('works with only moved items', async () => {
		const mockedObserver = makeMockedObserver<MockedDocument>();
		await diffSets(
			new Map([mockedDocument('a'), mockedDocument('b')]),
			new Map([mockedDocument('b'), mockedDocument('a')]),
			mockedObserver,
		);

		assert.deepEqual(mockedObserver.calls.all(), []);
	});

	it('works with projection function', async () => {
		const mockedObserver = makeMockedObserver<MockedDocument>();
		await diffSets(
			new Map([mockedDocument('a'), mockedDocument('b')]),
			new Map([mockedDocument('a', 'A'), mockedDocument('b', 'B')]),
			mockedObserver,
			() => ({}),
		);

		assert.deepEqual(mockedObserver.calls.all(), []);
	});

	it('works in complex case (1)', async () => {
		const mockedObserver = makeMockedObserver<MockedDocument>();
		await diffSets(
			new Map([mockedDocument('a'), mockedDocument('b'), mockedDocument('c')]),
			new Map([
				mockedDocument('c'),
				mockedDocument('b', 'x'),
				mockedDocument('d'),
			]),
			mockedObserver,
			({satellite}) => ({satellite: satellite.toUpperCase()}),
		);

		assert.deepEqual(mockedObserver.calls.all(), [
			['changed', 'b', {satellite: 'X'}],
			['added', 'd', {satellite: 'D'}],
			['removed', 'a'],
		]);
	});

	it('works in complex case (2)', async () => {
		const mockedObserver = makeMockedObserver<MockedDocument>();
		await diffSets(
			new Map([mockedDocument('a'), mockedDocument('b'), mockedDocument('c')]),
			new Map([
				mockedDocument('c'),
				mockedDocument('d'),
				mockedDocument('b', 'x'),
			]),
			mockedObserver,
			({satellite}) => ({satellite: satellite.toUpperCase()}),
		);

		assert.deepEqual(mockedObserver.calls.all(), [
			['added', 'd', {satellite: 'D'}],
			['changed', 'b', {satellite: 'X'}],
			['removed', 'a'],
		]);
	});
});
