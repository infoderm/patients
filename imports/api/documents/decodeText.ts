// @ts-expect-error Needs more recent @types/node
import {type Buffer} from 'buffer';

const decodeText = async (encoding: string, array: Uint8Array) => {
	// Console.debug('constructing decoder');
	// const decoder = new TextDecoder(encoding, {fatal: true});
	// console.debug('trying to decode with', decoder, '...');
	// const decoded = decoder.decode(array.buffer, {stream: false});
	const iconv = await import('iconv-lite');
	// `as Buffer` below is a temporary type hack.
	// Waiting for https://github.com/ashtuchkin/iconv-lite/issues/235
	// NOTE will throw a meaningful Error if it cannot find the codec
	return iconv.decode(array as Buffer, encoding);
};

export default decodeText;
