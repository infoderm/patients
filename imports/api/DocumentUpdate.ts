import schema from '../util/schema';

export type RequiredKeys<T> = {
	[K in keyof T]-?: {} extends {[P in K]: T[K]} ? never : K;
}[keyof T];

export type OptionalKeys<T> = {
	[K in keyof T]-?: {} extends {[P in K]: T[K]} ? K : never;
}[keyof T];

export type DocumentUpdate<T> = {
	[K in RequiredKeys<T>]?: T[K];
} & {
	[K in OptionalKeys<T>]?: T[K] | null;
};

export type DocumentUpdateEntry<T> =
	| [RequiredKeys<T>, T[RequiredKeys<T>]]
	| [OptionalKeys<T>, T[OptionalKeys<T>] | null];

export const documentUpdate = <S extends schema.ZodTypeAny>(
	tSchema: S,
): schema.ZodType<DocumentUpdate<schema.infer<S>>> => {
	if (tSchema instanceof schema.ZodObject) {
		return schema.object(
			Object.fromEntries(
				Object.entries(tSchema.shape).map(([key, value]) => [
					key,
					value instanceof schema.ZodOptional
						? schema.nullable(value)
						: schema.optional(value as schema.ZodTypeAny),
				]),
			),
		) as schema.ZodType<DocumentUpdate<schema.infer<S>>>;
	}

	console.debug({tSchema});
	throw new Error(`Not implemented: documentUpdate(${tSchema._def.typeName})`);
};
