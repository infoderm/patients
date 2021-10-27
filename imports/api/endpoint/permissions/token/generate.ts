import {check} from 'meteor/check';

import {beginningOfTime, endOfTime} from '../../../../util/datetime';
import {PermissionTokens} from '../../../collection/permissionTokens';

import {genKey, HMACConfig, sign} from '../../../../lib/hmac';

import define from '../../define';
import {encode} from '../../../permissions/token';

const TOKEN_HASH_ALGO = 'sha256';
// see https://crypto.stackexchange.com/questions/34864/key-size-for-hmac-sha256
// see https://crypto.stackexchange.com/questions/31473/what-size-should-the-hmac-key-be-with-sha-256
const TOKEN_BYTES = 32;
const TOKEN_KEY_ENCODING = 'base64';
const TOKEN_SIG_ENCODING = 'base64';
const TOKEN_DOCUMENT_ENCODING = 'json';
const TOKEN_INPUT_ENCODING = 'utf8';

export default define({
	name: 'permissions.token.generate',
	validate(permissions: string[]) {
		check(permissions, Array);
	},
	async run(permissions: string[]) {
		const hashAlgo = TOKEN_HASH_ALGO;
		const documentEncoding = TOKEN_DOCUMENT_ENCODING;
		const signatureEncoding = TOKEN_SIG_ENCODING;
		const keyEncoding = TOKEN_KEY_ENCODING;
		const inputEncoding = TOKEN_INPUT_ENCODING;
		const hmac: HMACConfig = {
			hashAlgo,
			keyEncoding,
			signatureEncoding,
			documentEncoding,
			inputEncoding,
		};
		const key = await genKey(TOKEN_BYTES, hmac);
		const fields = {
			owner: this.userId,
			hmac,
			permissions,
			userId: [this.userId],
			validFrom: beginningOfTime(),
			validUntil: endOfTime(),
			createdAt: new Date(),
		};
		const signature = await sign(key, fields);
		const permissionToken = {
			...fields,
			signature,
		};
		const _id = PermissionTokens.insert(permissionToken);
		return encode(_id, key);
	},
	simulate(_permissions: string[]) {
		return undefined;
	},
});