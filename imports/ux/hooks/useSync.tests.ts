import {assert} from 'chai';

import {useMemo} from 'react';

import {list} from '@iterable-iterator/list';
import {nrepeat} from '@iterable-iterator/repeat';
import {filter} from '@iterable-iterator/filter';

import {renderHook, waitFor} from '../../_test/react';
import {client} from '../../_test/fixtures';

import sleep from '../../util/async/sleep';

import {AsyncQueue} from '../../util/async/queue';

import {useSync} from './useSync';

client(__filename, () => {
	it('should have client value identical to server value on init when loading = false', async () => {
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

	it('should have client value identical to server value on init when loading = true', async () => {
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

	it('should take server updates into account', async () => {
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

	it('should debounce server updates', async () => {
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

	it('should take loaded server value into account immediately', async () => {
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
					loading: true,
					serverValue: serverValueA,
					inputDebounceTimeout: 0,
					reactivityDebounceTimeout: 1000,
				},
			},
		);

		assert.strictEqual(result.current.value, serverValueA);

		const serverValueB = 'B';

		rerender({
			loading: false,
			serverValue: serverValueB,
			inputDebounceTimeout: 0,
			reactivityDebounceTimeout: 1000,
		});

		assert.strictEqual(result.current.value, serverValueB);
	});

	it('should debounce client updates', async () => {
		const inputDebounceTimeout = 0;
		const reactivityDebounceTimeout = 1000;
		const serverValueSequence = 'ABCDEFGHIJ';
		const queue = new AsyncQueue();
		const setServerValue = async (newValue: string) => {
			queue.enqueue(async () => sleep(10)); // NOTE: Simulates sending.
			queue.enqueue(async () => sleep(30)); // NOTE: Simulates receiving.
			queue.enqueue(() => {
				rerender({
					loading: false,
					serverValue: newValue,
					inputDebounceTimeout,
					reactivityDebounceTimeout,
				});
			});
			// NOTE: A real setter cannot await feedback so we do not.
		};

		const {result, rerender} = renderHook(
			({
				loading,
				serverValue,
				inputDebounceTimeout,
				reactivityDebounceTimeout,
			}) => {
				const {
					value: clientValue,
					setValue: setClientValue,
					sync,
				} = useSync(
					loading,
					serverValue,
					inputDebounceTimeout,
					reactivityDebounceTimeout,
				);

				const setValue = useMemo(() => {
					return async (newValue: string) =>
						sync(
							() => {
								setClientValue(newValue);
							},
							async () => setServerValue(newValue),
						);
				}, [sync, setClientValue, setServerValue]);

				return {
					clientValue,
					serverValue,
					setValue,
				};
			},
			{
				initialProps: {
					loading: false,
					serverValue: serverValueSequence[0]!,
					inputDebounceTimeout,
					reactivityDebounceTimeout,
				},
			},
		);

		// NOTE: Check initial value is correct.
		assert.strictEqual(result.current.clientValue, serverValueSequence[0]!);

		// NOTE: Trigger a sequence of updates.
		for (const newValue of serverValueSequence.slice(1)) {
			// eslint-disable-next-line no-await-in-loop
			await sleep(5);
			// NOTE: This is how `setValue` would be used in an `onChange`
			// handler.
			void result.current.setValue(newValue);
		}

		type Target = {name: string; values: string[]};
		const observed: {server: Target; client: Target} = {
			server: {
				name: 'server',
				values: [],
			},
			client: {
				name: 'client',
				values: [],
			},
		};

		const observe = (target: Target, value: string) => {
			if (value !== target.values.at(-1)) {
				target.values.push(value);
			}
		};

		await waitFor(() => {
			const {
				current: {clientValue, serverValue},
			} = result;
			observe(observed.server, serverValue);
			// TODO: Last update should happen almost instantly. Should be
			// instantly.
			assert.strictEqual(clientValue, serverValueSequence.at(-1));
		});

		await waitFor(
			() => {
				const {
					current: {clientValue, serverValue},
				} = result;
				observe(observed.client, clientValue);
				observe(observed.server, serverValue);
				assert.strictEqual(serverValue, serverValueSequence.at(-1));
			},
			{timeout: inputDebounceTimeout + reactivityDebounceTimeout * 2},
		);

		assert.isAtLeast(observed.client.values.length, 1);
		assert.isAtLeast(observed.server.values.length, 1);

		assert.deepEqual(observed.client, {
			name: 'client',
			values: list(
				nrepeat(serverValueSequence.at(-1), observed.client.values.length),
			),
		});

		const _observedServerValues = new Set(observed.server.values);

		assert.deepEqual(observed.server, {
			name: 'server',
			values: list(
				filter(
					(value: string) => _observedServerValues.has(value),
					serverValueSequence,
				),
			),
		});
	});
});
