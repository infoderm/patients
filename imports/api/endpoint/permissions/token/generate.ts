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

const defaultHMACConfig = (): HMACConfig => ({
	hashAlgo: TOKEN_HASH_ALGO,
	keyEncoding: TOKEN_KEY_ENCODING,
	signatureEncoding: TOKEN_SIG_ENCODING,
	documentEncoding: TOKEN_DOCUMENT_ENCODING,
	inputEncoding: TOKEN_INPUT_ENCODING,
});

export default define({
	name: 'permissions.token.generate',
	validate(permissions: string[]) {
		check(permissions, Array);
	},
	async run(permissions: string[]) {
		const hmac = defaultHMACConfig();
		const key = await genKey(TOKEN_BYTES, hmac);
		const now = new Date();
		const fields = {
			owner: this.userId,
			hmac,
			permissions,
			userId: [this.userId],
			validFrom: beginningOfTime(),
			validUntil: endOfTime(),
			createdAt: now,
			lastUsedAt: now,
			lastUsedIPAddress: this.connection.clientAddress,
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
		throw new Error('simulation not-implemented');
	},
});
