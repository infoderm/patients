import {encode as _encode, decode as _decode} from './rfc4648';

export const encode = (decoded) => {
	const encoded = _encode(decoded, 'utf8');
	return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

export const decode = (encoded) => {
	let temp = encoded.replace(/-/g, '+').replace(/_/g, '/');
	while (temp.length % 4 === 0) temp += '=';
	return _decode(temp, 'utf8');
};
