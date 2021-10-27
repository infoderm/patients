import {encode as _encode, decode as _decode} from '../../lib/base64/rfc7515';

export const encode = (_id: string, key: string) =>
	_encode(JSON.stringify({_id, key}));

export const decode = (token: string) => JSON.parse(_decode(token));
