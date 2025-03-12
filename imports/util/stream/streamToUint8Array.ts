import {type Readable} from 'stream';

import bufferToUint8ArrayView from '../buffer/bufferToUint8ArrayView';

import streamToBuffer from './streamToBuffer';

const streamToUint8Array = async (stream: Readable) => {
	const buffer = await streamToBuffer(stream);
	return bufferToUint8ArrayView(buffer);
};

export default streamToUint8Array;
