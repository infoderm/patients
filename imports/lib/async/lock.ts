import createPromise from './createPromise';

class LockReleaseHandle {
	#internals = createPromise<void>();

	public async _promise(): Promise<void> {
		return this.#internals.promise;
	}

	public _resolve() {
		this.#internals.resolve();
	}
}

export class AcquiringLockWouldBlockError extends Error {
	constructor() {
		super('Acquiring lock would block');
	}
}

export class AsyncLock {
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
			// NOTE: Garbage collect. Part of non-blocking acquisition logic.
			this.#lastHandle = null;
		}

		handle._resolve();
	}
}
