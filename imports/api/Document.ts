import schema from '../lib/schema';

const literalSchema = schema.union([
	schema.string(),
	schema.number(),
	schema.boolean(),
	schema.undefined(), // TODO: Keep in document, remove from updates.
	schema.null(), // TODO: Remove from document, add to update.
	schema.date(),
]);

type Literal = schema.infer<typeof literalSchema>;

type DocumentValue = Literal | {[key: string]: DocumentValue} | DocumentValue[];

const documentValue: schema.ZodType<DocumentValue> = schema.lazy(() =>
	schema.union([
		literalSchema,
		schema.record(schema.string(), documentValue),
		schema.array(documentValue),
	]),
);

const documentKey = schema.string();

export const document = schema.record(documentKey, documentValue);
// TODO: The following does not work:
// type Document = schema.infer<typeof document>;
// type Document = Record<string, DocumentValue>;
type Document = Record<string, any>;

export default Document;
