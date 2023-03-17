import Collection from '../Collection';

import {hmacConfig} from '../../lib/hmac';
import schema from '../../lib/schema';

export const permissionTokenFields = schema.object({
	userId: schema.array(schema.string()).optional(),
	groupId: schema.array(schema.string()).optional(),
	permissions: schema.array(schema.string()),
	validFrom: schema.date(),
	validUntil: schema.date(),
	hmac: hmacConfig,
	signature: schema.string(),
});

export type PermissionTokenFields = schema.infer<typeof permissionTokenFields>;

export const permissionTokenComputedFields = schema.object({});

export type PermissionTokenComputedFields = schema.infer<
	typeof permissionTokenComputedFields
>;

export const permissionTokenMetadata = schema.object({
	_id: schema.string(),
	owner: schema.string(),
	createdAt: schema.date(),
	lastUsedAt: schema.date(),
	lastUsedIPAddress: schema.string(),
});

export type PermissionTokenMetadata = schema.infer<
	typeof permissionTokenMetadata
>;

export const permissionTokenDocument = permissionTokenFields
	.merge(permissionTokenComputedFields)
	.merge(permissionTokenMetadata);

export type PermissionTokenDocument = schema.infer<
	typeof permissionTokenDocument
>;

const collection = 'permissionTokens';
export const PermissionTokens = new Collection<PermissionTokenDocument>(
	collection,
);
