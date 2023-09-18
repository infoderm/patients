import schema from '../../lib/schema';

import define from './define';

export const patient = schema
	.object({
		firstname: schema.string(),
		lastname: schema.string(),
	})
	.strict();

export type Patient = schema.infer<typeof patient>;

export const documentResult = schema
	.object({
		name: schema.string(),
		flag: schema.string().optional(),
		code: schema.string().optional(),
		measure: schema.string().optional(),
		unit: schema.string().optional(),
		normal: schema.string().optional(),
	})
	.strict();

export type DocumentResult = schema.infer<typeof documentResult>;

export const documentId = schema.string();
export type DocumentId = schema.infer<typeof documentId>;

export const rawDocument = schema
	.object({
		parsed: schema.literal(false),
		text: schema.undefined(),
		format: schema.undefined(),
		kind: schema.undefined(),
		patientId: schema.undefined(),
		identifier: schema.undefined(),
		reference: schema.undefined(),
		datetime: schema.undefined(),
		lastVersion: schema.undefined(),
		anomalies: schema.undefined(),
		patient: schema.undefined(),
		status: schema.undefined(),
		results: schema.undefined(),
	})
	.strict();

export const parsedDocument = schema
	.object({
		parsed: schema.literal(true),
		text: schema.array(schema.string()),
		format: schema.string(),
		kind: schema.string(),
		patientId: schema.string(),
		identifier: schema.string(),
		reference: schema.string(),
		datetime: schema.date(),
		lastVersion: schema.boolean(),
		anomalies: schema.number().int(),
		patient,
		status: schema.string(),
		results: schema.array(documentResult),
	})
	.strict();

export type ParsedDocumentDocument = schema.infer<typeof parsedDocument>;

export const documentDocument = schema
	.object({
		_id: documentId,
		owner: schema.string(),
		encoding: schema.string().optional(),
		decoded: schema.string(),
		source: schema.string(),
		createdAt: schema.date(),
		deleted: schema.boolean().optional(),
	})
	.strict()
	.and(schema.union([rawDocument, parsedDocument]));

export type DocumentDocument = schema.infer<typeof documentDocument>;

export const Documents = define<DocumentDocument>('documents');
