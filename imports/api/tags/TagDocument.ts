import schema from '../../lib/schema';
import {formattedLineSchema, normalizedLineSchema} from '../string';

export const tagNameFields = schema.object({
	displayName: formattedLineSchema.optional(),
	name: normalizedLineSchema,
});

export type TagNameFields = schema.infer<typeof tagNameFields>;

export const tagComputedFields = schema.object({
	containsNonAlphabetical: schema.boolean(),
});

export type TagComputedFields = schema.infer<typeof tagComputedFields>;

export const tagMetadata = schema.object({
	_id: schema.string(),
	owner: schema.string(),
});

export type TagMetadata = schema.infer<typeof tagMetadata>;

export const tagDocument = tagNameFields
	.merge(tagComputedFields)
	.merge(tagMetadata);

type TagDocument = schema.infer<typeof tagDocument>;

export default TagDocument;
