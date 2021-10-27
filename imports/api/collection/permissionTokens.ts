import {Mongo} from 'meteor/mongo';
import {HMACConfig} from '../../lib/hmac';

export interface PermissionTokenFields {
	userId?: string[];
	groupId?: string[];
	permissions: string[];
	validFrom: Date;
	validUntil: Date;
	hmac: HMACConfig;
	signature: string;
}

type PermissionTokenComputedFields = {};

interface PermissionTokenMetadata {
	_id: string;
	createdAt: Date;
}

export type PermissionTokenDocument = PermissionTokenFields &
	PermissionTokenComputedFields &
	PermissionTokenMetadata;

const collection = 'permissionTokens';
export const PermissionTokens = new Mongo.Collection<PermissionTokenDocument>(
	collection,
);
