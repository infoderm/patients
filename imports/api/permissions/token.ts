import {
	PermissionTokenDocument,
	PermissionTokens,
} from '../collection/permissionTokens';
import {extractSignature, sign, SignedDocument, verify} from '../../lib/hmac';
import {encode as _encode, decode as _decode} from '../../lib/base64/rfc7515';
import executeTransaction from '../transaction/executeTransaction';

export const encode = (_id: string, key: string) =>
	_encode(JSON.stringify({_id, key}));

export const decode = (token: string) => JSON.parse(_decode(token));

type AddIdKey<T> = T & {_id: string};

const extractPermissions = <T>({
	_id,
	...rest
}: T extends SignedDocument ? AddIdKey<T> : never) => rest;

export class PermissionTokenValidationError extends Error {
	_HTTPErrorCode: number;
	constructor(HTTPErrorCode: number) {
		const message = `PermissionTokenValidationError(${HTTPErrorCode})`;
		super(message);
		this._HTTPErrorCode = HTTPErrorCode;
	}

	getHTTPErrorCode() {
		return this._HTTPErrorCode;
	}
}

export const getPermissionsForToken = async (
	token: string,
	ipAddress: string,
	query: string,
) =>
	executeTransaction(
		async (db): Promise<Omit<PermissionTokenDocument, '_id' | 'signature'>> => {
			let decoded;
			try {
				decoded = decode(token);
			} catch {
				throw new PermissionTokenValidationError(422);
			}

			const {_id, key} = decoded;

			if (typeof _id !== 'string' || typeof key !== 'string') {
				throw new PermissionTokenValidationError(422);
			}

			const now = new Date();

			const document = await db.findOne(PermissionTokens, {
				_id,
				permissions: query,
				validFrom: {$lte: now},
				validUntil: {$gt: now}, // TODO use mongo's internal Date?
			});

			if (document === null) {
				throw new PermissionTokenValidationError(404);
			}

			const permissions = extractPermissions(document); // _id is not part of signature

			const signatureIsValid: boolean = await verify(key, permissions);

			if (!signatureIsValid) {
				// throw new PermissionTokenValidationError(401); // see https://stackoverflow.com/q/45153773 and https://stackoverflow.com/a/1960453
				throw new PermissionTokenValidationError(
					404 /* stealth, although timing side-channel is exposed */,
				);
			}

			const lastUsedIPAddress = ipAddress;
			const lastUsedAt = now;
			const newPermissions = {
				...extractSignature(permissions).document,
				lastUsedIPAddress,
				lastUsedAt,
			};
			const newSignature = await sign(key, newPermissions);

			await db.updateOne(
				PermissionTokens,
				{_id},
				{
					$set: {
						lastUsedAt,
						lastUsedIPAddress,
						signature: newSignature,
					},
				},
			);

			return newPermissions;
		},
	);
