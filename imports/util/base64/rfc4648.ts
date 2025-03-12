import {Buffer} from 'buffer';

export const encode = (decoded: string, encoding: BufferEncoding = 'utf8') =>
	Buffer.from(decoded, encoding).toString('base64');

export const decode = (encoded: string, encoding: BufferEncoding = 'utf8') =>
	Buffer.from(encoded, 'base64').toString(encoding);
