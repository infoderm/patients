// @ts-expect-error Needs more recent @types/node
import {type Buffer} from 'buffer';
import {type Readable} from 'stream';

const streamToChunks = async (stream: Readable) =>
	new Promise<Buffer[]>((resolve, reject) => {
		stream.on('error', (error: Error) => {
			reject(error);
		});

		const chunks: Buffer[] = [];

		stream.on('data', (chunk: Buffer) => {
			chunks.push(chunk);
		});

		stream.on('end', () => {
			resolve(chunks);
		});
	});

export default streamToChunks;
