import schema from '../schema';

export const literalSchema = schema.union([
	schema.string(),
	schema.number(),
	schema.boolean(),
	schema.null(),
	schema.undefined(),
	schema.date(),
]);

export type Literal = schema.infer<typeof literalSchema>;

export type BSON = Literal | {[key: string]: BSON} | BSON[];

export const bsonSchema: schema.ZodType<BSON> = schema.lazy(() =>
	schema.union([
		literalSchema,
		schema.record(schema.string(), bsonSchema),
		schema.array(bsonSchema),
	]),
);
