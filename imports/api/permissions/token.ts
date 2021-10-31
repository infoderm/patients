import {PermissionTokens} from '../collection/permissionTokens';
import {
	extractSignature,
	Document,
	SignedDocument,
	verify,
} from '../../lib/hmac';
import {encode as _encode, decode as _decode} from '../../lib/base64/rfc7515';
import {ICS_CALENDAR_READ} from './codes';

export const encode = (_id: string, key: string) =>
	_encode(JSON.stringify({_id, key}));

export const decode = (token: string) => JSON.parse(_decode(token));

const extractPermissions = ({_id, ...rest}) => rest as SignedDocument;

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
): Promise<Document> => {
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

	const document = PermissionTokens.findOne({
		_id,
		permissions: ICS_CALENDAR_READ,
		validFrom: {$lte: now},
		validUntil: {$gt: now}, // TODO use mongo's internal Date?
	});

	if (!document) {
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

	return extractSignature(permissions).document;
};
