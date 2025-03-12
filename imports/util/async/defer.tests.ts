import {assert} from 'chai';

import {isNode, isomorphic} from '../../_test/fixtures';

import {cancelAll, defer, flushAll} from './defer';
import sleep from './sleep';

isomorphic(__filename, () => {
	it('should queue to macrotask queue', async () => {
		const x: number[] = [];

		defer(() => x.push(1));

		assert.deepEqual(x, []);

		await Promise.resolve().then(() => {
			assert.deepEqual(x, []);
		});

		await sleep(0);

		assert.deepEqual(x, [1]);
	});

	it('should allow cancellation', async () => {
		const x: number[] = [];

		const deferred = defer(() => x.push(1));

		assert.deepEqual(x, []);

		await Promise.resolve().then(() => {
			assert.deepEqual(x, []);
		});

		deferred.cancel();

		await sleep(0);

		assert.deepEqual(x, []);
	});

	it('should allow flushing before microtask queue', async () => {
		const x: number[] = [];

		const deferred = defer(() => x.push(1));

		assert.deepEqual(x, []);

		deferred.flush();

		await Promise.resolve().then(() => {
			assert.deepEqual(x, [1]);
		});

		await sleep(0);

		assert.deepEqual(x, [1]);
	});

	it('should flush after main loop', async () => {
		const x: number[] = [];

		const deferred = defer(() => x.push(1));

		deferred.flush();

		assert.deepEqual(x, []);

		await Promise.resolve().then(() => {
			assert.deepEqual(x, [1]);
		});

		await sleep(0);

		assert.deepEqual(x, [1]);
	});

	it('should catch errors', async () => {
		const x: number[] = [];

		defer(() => {
			x.push(1);
			throw new Error('test');
		});

		await sleep(0);

		assert.deepEqual(x, [1]);
	});

	it('should catch errors when flushing', async () => {
		const x: number[] = [];

		const deferred = defer(() => {
			x.push(1);
			throw new Error('test');
		});

		deferred.flush();

		await sleep(0);

		assert.deepEqual(x, [1]);
	});

	it('should allow cancellation of all deferred computations', async () => {
		const x: number[] = [];

		defer(() => x.push(1));
		defer(() => x.push(2));

		assert.deepEqual(x, []);

		await Promise.resolve().then(() => {
			assert.deepEqual(x, []);
		});

		cancelAll();

		await sleep(0);

		assert.deepEqual(x, []);
	});

	it('should allow flushing all deferred computations before microtask queue', async () => {
		const x: number[] = [];

		defer(() => x.push(1));
		defer(() => x.push(2));

		assert.deepEqual(x, []);

		flushAll();

		await Promise.resolve().then(() => {
			assert.deepEqual(x, [1, 2]);
		});

		await sleep(0);

		assert.deepEqual(x, [1, 2]);
	});

	it('should flush all after main loop', async () => {
		const x: number[] = [];

		defer(() => x.push(1));
		defer(() => x.push(2));

		flushAll();

		assert.deepEqual(x, []);

		await Promise.resolve().then(() => {
			assert.deepEqual(x, [1, 2]);
		});

		await sleep(0);

		assert.deepEqual(x, [1, 2]);
	});

	it('should execute in order', async () => {
		const x: number[] = [];

		defer(() => {
			x.push(1);
		});
		defer(() => {
			x.push(2);
		});

		assert.deepEqual(x, []);

		await Promise.resolve().then(() => {
			assert.deepEqual(x, []);
		});

		await sleep(0);

		assert.deepEqual(x, [1, 2]);
	});

	it('should respect timeout', async () => {
		const x: number[] = [];

		const delay = isNode() ? 5 : 1;

		defer(() => {
			x.push(1);
		}, delay);
		defer(() => {
			x.push(2);
		});

		assert.deepEqual(x, []);

		await Promise.all([
			sleep(delay).then(() => {
				assert.deepEqual(x, [2, 1]);
			}),
			sleep(0).then(() => {
				assert.deepEqual(x, [2]);
			}),
			Promise.resolve().then(() => {
				assert.deepEqual(x, []);
			}),
		]);
	});

	it('should allow passing arguments', async () => {
		const x: number[] = [];
		defer(
			(a, b) => {
				x.push(a, b);
			},
			0,
			1,
			2,
		);

		assert.deepEqual(x, []);

		await Promise.resolve().then(() => {
			assert.deepEqual(x, []);
		});

		await sleep(0);

		assert.deepEqual(x, [1, 2]);
	});
});
