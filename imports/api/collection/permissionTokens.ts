import Collection from '../Collection';

import {type HMACConfig} from '../../lib/hmac';

export type PermissionTokenFields = {
	userId?: string[];
	groupId?: string[];
	permissions: string[];
	validFrom: Date;
	validUntil: Date;
	hmac: HMACConfig;
	signature: string;
};

type PermissionTokenComputedFields = {};

type PermissionTokenMetadata = {
	_id: string;
	createdAt: Date;
	lastUsedAt: Date;
	lastUsedIPAddress: string;
};

export type PermissionTokenDocument = PermissionTokenFields &
	PermissionTokenComputedFields &
	PermissionTokenMetadata;

const collection = 'permissionTokens';
export const PermissionTokens = new Collection<PermissionTokenDocument>(
	collection,
);
