import {Buffer} from 'buffer';
import {Readable} from 'stream';

const streamToBuffer = async (stream: Readable) =>
	new Promise<Buffer>((resolve, reject) => {
		stream.on('error', (error: Error) => {
			reject(error);
		});

		const chunks: Buffer[] = [];

		stream.on('data', (chunk: Buffer) => {
			chunks.push(chunk);
		});

		stream.on('end', () => {
			resolve(Buffer.concat(chunks));
		});
	});

export default streamToBuffer;
