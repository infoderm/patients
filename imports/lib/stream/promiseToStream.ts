import {Readable, ReadableOptions} from 'stream';

const promiseToStream = <T>(promise: Promise<T>, options: ReadableOptions) =>
	new StreamFromPromise(promise, options);

class StreamFromPromise<T> extends Readable {
	#promise: Promise<T>;

	constructor(promise: Promise<T>, options: ReadableOptions) {
		super(options);
		this.#promise = promise;
	}

	_read() {
		if (this.#promise !== null) {
			this.#promise.then(
				(result: any) => {
					this.push(result);
					this.push(null);
				},
				(error: unknown) => {
					this.emit('error', error);
					this.push(null);
				},
			);
			this.#promise = null;
		}
	}
}

export default promiseToStream;
