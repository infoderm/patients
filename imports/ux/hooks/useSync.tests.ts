import {assert} from 'chai';

import {renderHook, waitFor} from '../../_test/react';
import {client} from '../../_test/fixtures';

import sleep from '../../lib/async/sleep';

import {useSync} from './useSync';

client(__filename, () => {
	it('client value is identical to server value on init when loading = false', async () => {
		const serverValue = {};

		const {
			result: {
				current: {value: clientValue},
			},
		} = renderHook(
			({
				loading,
				serverValue,
				inputDebounceTimeout,
				reactivityDebounceTimeout,
			}) =>
				useSync(
					loading,
					serverValue,
					inputDebounceTimeout,
					reactivityDebounceTimeout,
				),
			{
				initialProps: {
					loading: false,
					serverValue,
					inputDebounceTimeout: 0,
					reactivityDebounceTimeout: 0,
				},
			},
		);

		assert.strictEqual(clientValue, serverValue);
	});

	it('client value is identical to server value on init when loading = true', async () => {
		const serverValue = {};

		const {
			result: {
				current: {value: clientValue},
			},
		} = renderHook(
			({
				loading,
				serverValue,
				inputDebounceTimeout,
				reactivityDebounceTimeout,
			}) =>
				useSync(
					loading,
					serverValue,
					inputDebounceTimeout,
					reactivityDebounceTimeout,
				),
			{
				initialProps: {
					loading: false,
					serverValue,
					inputDebounceTimeout: 0,
					reactivityDebounceTimeout: 0,
				},
			},
		);

		assert.strictEqual(clientValue, serverValue);
	});

	it('server value updates are taken into account', async () => {
		const serverValueA = 'A';

		const {result, rerender} = renderHook(
			({
				loading,
				serverValue,
				inputDebounceTimeout,
				reactivityDebounceTimeout,
			}) =>
				useSync(
					loading,
					serverValue,
					inputDebounceTimeout,
					reactivityDebounceTimeout,
				),
			{
				initialProps: {
					loading: false,
					serverValue: serverValueA,
					inputDebounceTimeout: 0,
					reactivityDebounceTimeout: 100,
				},
			},
		);

		assert.strictEqual(result.current.value, serverValueA);

		const serverValueB = 'B';

		rerender({
			loading: false,
			serverValue: serverValueB,
			inputDebounceTimeout: 0,
			reactivityDebounceTimeout: 100,
		});

		await waitFor(() => {
			assert.strictEqual(result.current.value, serverValueB);
		});
	});

	it('server value updates are debounced', async () => {
		const initialValue = 0;

		const {result, rerender} = renderHook(
			({
				loading,
				serverValue,
				inputDebounceTimeout,
				reactivityDebounceTimeout,
			}) =>
				useSync(
					loading,
					serverValue,
					inputDebounceTimeout,
					reactivityDebounceTimeout,
				),
			{
				initialProps: {
					loading: false,
					serverValue: initialValue,
					inputDebounceTimeout: 0,
					reactivityDebounceTimeout: 100,
				},
			},
		);

		assert.strictEqual(result.current.value, initialValue);

		let currentValue = initialValue;

		for (let i = 0; i < 10; ++i) {
			// eslint-disable-next-line no-await-in-loop
			await sleep(20);
			rerender({
				loading: false,
				serverValue: ++currentValue,
				inputDebounceTimeout: 0,
				reactivityDebounceTimeout: 100,
			});
		}

		const observedValues = new Set();

		await waitFor(() => {
			const {
				current: {value},
			} = result;
			observedValues.add(value);
			assert.strictEqual(value, currentValue);
		});

		assert.deepEqual(observedValues, new Set([0, currentValue]));
	});

	// TODO: Test toggling from `loading` to `!loading`.
});
