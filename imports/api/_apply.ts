import {Meteor} from 'meteor/meteor';
import {DDP} from 'meteor/ddp';

import promisify from '../lib/async/promisify';

import createPromise from '../lib/async/createPromise';

import type Options from './endpoint/Options';
import type Args from './Args';
import type Serializable from './Serializable';

class LockReleaseHandle {
	#internals = createPromise<void>();

	public async _promise(): Promise<void> {
		return this.#internals.promise;
	}

	public _resolve() {
		this.#internals.resolve();
	}
}

class Lock {
	#lastHandle: LockReleaseHandle | null = null;

	public async acquire() {
		const release = this.#lastHandle?._promise();
		const handle = new LockReleaseHandle();

		this.#lastHandle = handle;

		await release;

		return handle;
	}

	public release(handle: LockReleaseHandle) {
		if (handle === this.#lastHandle) {
			// NOTE: Garbage collect.
			this.#lastHandle = null;
		}

		handle._resolve();
	}
}

const _lock = new Lock();

const __meteor_apply_promisified = promisify(
	// @ts-expect-error Private access.
	Meteor.applyAsync.bind(Meteor),
);

const _apply = async <R extends Serializable>(
	name: string,
	args: Args,
	options?: Options<R>,
): Promise<R> => {
	// NOTE Like
	// https://github.com/meteor/meteor/blob/5f77b43f758746b585ff92b6632d45ea0cd082cd/packages/ddp-client/common/livedata_connection.js#L606-L617
	// but allowing to customize options.
	const applyOptions = {
		isFromCallAsync: true,
		...options,
	};
	const handle = await _lock.acquire();
	try {
		// @ts-expect-error Private access.
		DDP._CurrentMethodInvocation._set();
		// @ts-expect-error Private access.
		DDP._CurrentMethodInvocation._setCallAsyncMethodRunning(true);
		const result = await __meteor_apply_promisified(name, args, applyOptions);
		// @ts-expect-error Private access.
		DDP._CurrentMethodInvocation._setCallAsyncMethodRunning(false);
		return result as R;
	} finally {
		_lock.release(handle);
	}
};

export default _apply;
