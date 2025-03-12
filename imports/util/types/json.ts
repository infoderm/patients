import schema from '../schema';

const literalSchema = schema.union([
	schema.string(),
	schema.number(),
	schema.boolean(),
	schema.null(),
]);

type Literal = schema.infer<typeof literalSchema>;

export type JSON = Literal | {[key: string]: JSON} | JSON[];

export const jsonSchema: schema.ZodType<JSON> = schema.lazy(() =>
	schema.union([
		literalSchema,
		schema.record(schema.string(), jsonSchema),
		schema.array(jsonSchema),
	]),
);
