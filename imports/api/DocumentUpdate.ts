import schema from '../lib/schema';

export type DocumentUpdate<T> = {
	[K in keyof T]?: T[K] | null;
};

export const documentUpdate = <S extends schema.ZodTypeAny>(
	tSchema: S,
): schema.ZodType<DocumentUpdate<schema.infer<S>>> => {
	if (tSchema instanceof schema.ZodObject) {
		return schema.object(
			Object.fromEntries(
				Object.entries(tSchema.shape).map(([key, value]) => [
					key,
					(value as any).nullable().optional(),
				]),
			),
		) as schema.ZodType<DocumentUpdate<schema.infer<S>>>;
	}

	console.debug({tSchema});
	throw new Error(`Not implemented: documentUpdate(${tSchema._def.typeName})`);
};
