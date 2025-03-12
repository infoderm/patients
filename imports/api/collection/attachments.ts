import schema from '../../util/schema';
import {Uploads, meta} from '../uploads';

export const Attachments = Uploads.collection;

export const version = <MetadataType extends schema.ZodTypeAny>(
	meta: MetadataType,
) =>
	schema
		.object({
			extension: schema.string(),
			meta,
			path: schema.string(),
			size: schema.number(),
			type: schema.string(),
		})
		.strict();

export const fileObj = <MetadataType extends schema.ZodTypeAny>(
	meta: MetadataType,
) =>
	schema
		.object({
			_id: schema.string(),
			size: schema.number(),
			name: schema.string(),
			type: schema.string(),
			path: schema.string(),
			isVideo: schema.boolean(),
			isAudio: schema.boolean(),
			isImage: schema.boolean(),
			isText: schema.boolean(),
			isJSON: schema.boolean(),
			isPDF: schema.boolean(),
			ext: schema.string().optional(),
			extension: schema.string().optional(),
			extensionWithDot: schema.string(),
			_storagePath: schema.string(),
			_downloadRoute: schema.string(),
			_collectionName: schema.string(),
			public: schema.boolean().optional(),
			meta: meta.optional(),
			userId: schema.string().optional(),
			updatedAt: schema.date().optional(),
			versions: schema.record(schema.string(), version(meta)),

			mime: schema.string(),
			'mime-type': schema.string(),
		})
		.strict();

export const attachmentDocument = fileObj(meta);

export type AttachmentDocument = schema.infer<typeof attachmentDocument>;
