import {Buffer} from 'buffer';
import {type Readable} from 'stream';

import streamToChunks from './streamToChunks';

const streamToBuffer = async (stream: Readable) => {
	const chunks = await streamToChunks(stream);
	return Buffer.concat(chunks);
};

export default streamToBuffer;
