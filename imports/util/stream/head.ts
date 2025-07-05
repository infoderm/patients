import {asyncIterableToArray} from '@async-iterable-iterator/async-iterable-to-array';

const _head = async function* (reader: ReadableStreamDefaultReader, n: number) {
	while (n > 0) {
		// eslint-disable-next-line no-await-in-loop
		const {value, done} = await reader.read();
		if (done) break;
		yield value;
		n -= value.length;
	}
};

const head = async (stream: ReadableStream, n: number) => {
	const reader = stream.getReader();
	const chunks = await asyncIterableToArray(_head(reader, n));
	reader.releaseLock();

	return chunks.flatMap((chunk) => Array.from(chunk)).slice(0, n);
};

export default head;
