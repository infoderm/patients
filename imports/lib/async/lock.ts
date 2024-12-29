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

	public acquireNonBlocking() {
		if (this.#lastHandle !== null) {
			throw new AcquiringLockWouldBlockError();
		}

		const handle = new LockReleaseHandle();

		this.#lastHandle = handle;

		return handle;
	}

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

export const withBlocking = async <T>(
	lock: AsyncLock,
	callback: () => Promise<T> | T,
) => {
	const handle = await lock.acquire();

	try {
		await callback();
	} finally {
		lock.release(handle);
	}
};

export const withNonBlockingAsync = async <T>(
	lock: AsyncLock,
	callback: () => Promise<T> | T,
) => {
	const handle = lock.acquireNonBlocking();

	try {
		await callback();
	} finally {
		lock.release(handle);
	}
};

export const withNonBlocking = async <T>(
	lock: AsyncLock,
	callback: () => T,
) => {
	const handle = lock.acquireNonBlocking();

	try {
		callback();
	} finally {
		lock.release(handle);
	}
};
