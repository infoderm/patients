export class AsyncQueue {
	#queued = 0;
	#queue: Promise<void> | null = null;

	public get length() {
		return this.#queued;
	}

	// TODO: Enable task cancellation.
	public enqueue(task: () => Promise<void> | void) {
		++this.#queued;
		const handle = Promise.resolve(this.#queue)
			.then(async () => {
				--this.#queued;
				await task();
				if (this.#queue === handle) {
					// NOTE: Garbage collection.
					this.#queue = null;
				}
			})
			.catch((error) => {
				console.error({error});
			});

		this.#queue = handle;
	}

	public async drain() {
		await this.#queue;
	}
}
