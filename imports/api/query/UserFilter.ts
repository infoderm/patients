import {chain} from '@iterable-iterator/chain';
import {map} from '@iterable-iterator/map';
import {type BSONRegExp} from 'bson';

import schema from '../../lib/schema';
import type Document from '../Document';
import {document} from '../Document'; // TODO Replace this
import type WithId from './WithId';
import {
	fieldSpecifiers,
	propertyType,
	type FieldSpecifiers,
	type PropertyType,
} from './dotNotation';
import type BSONType from './BSONType';
import type BitwiseFilter from './BitwiseFilter';
import {bsonType} from './BSONType';
import {bitwiseFilter} from './BitwiseFilter';

type RootFilterOperators<TSchema> = {
	$expr?: Record<string, any>;
	$and?: Array<UserFilter<TSchema>>;
	$nor?: Array<UserFilter<TSchema>>;
	$or?: Array<UserFilter<TSchema>>;
	$text?: {
		$search: string;
		$language?: string;
		$caseSensitive?: boolean;
		$diacriticSensitive?: boolean;
	};
};

type UserFilter<TSchema> = {
	[P in FieldSpecifiers<WithId<TSchema>>]?: Condition<
		PropertyType<WithId<TSchema>, P>
	>;
} & RootFilterOperators<WithId<TSchema>>;

const $text = schema.object({
	$search: schema.string(),
	$language: schema.string().optional(),
	$caseSensitive: schema.boolean().optional(),
	$diacriticSensitive: schema.boolean().optional(),
});

const $expr = <S extends schema.ZodTypeAny>(
	// @ts-expect-error TODO
	tSchema: S /* TODO */,
) => schema.record(schema.string(), schema.any());

export const userFilter = <S extends schema.ZodTypeAny>(
	tSchema: S,
): schema.ZodType<UserFilter<schema.infer<S>>> => {
	const as = schema.lazy(() => schema.array(s));
	const s = schema
		.object(
			Object.fromEntries(
				chain(
					map(
						(key) => [key, condition(propertyType(tSchema, key) as any)],
						fieldSpecifiers(tSchema),
					),
					[
						['$and', as],
						['$nor', as],
						['$or', as],
						['$expr', $expr(tSchema)],
						['$text', $text],
					],
				),
			),
		)
		.strict()
		.partial();

	return s;
};

export type Condition<T> =
	| AlternativeType<T>
	| FilterOperators<AlternativeType<T>>;

/**
 * It is possible to search using alternative types in mongodb e.g.
 * string types can be searched using a regex in mongo
 * array types can be searched using their element type
 */
type AlternativeType<T> = T extends ReadonlyArray<infer U>
	? T | Condition<U>
	: RegExpOrString<T>;

type RegExpOrString<T> = T extends string ? BSONRegExp | RegExp | T : T;

export const condition = <S extends schema.ZodTypeAny>(
	tSchema: S,
): schema.ZodType<Condition<schema.infer<S>>> => {
	const alt = alternativeType(tSchema);
	return schema.union([alt, filterOperators(alt)]);
};

const alternativeType = <S extends schema.ZodTypeAny>(
	tSchema: S,
): schema.ZodType<AlternativeType<schema.infer<S>>> => {
	tSchema = unwrap(tSchema);

	if (tSchema instanceof schema.ZodArray) {
		return schema.union([tSchema, condition(tSchema.element)]);
	}

	return regExpOrString(tSchema) as any;
};

const regExpOrString = <S extends schema.ZodTypeAny>(
	tSchema: S,
): schema.ZodType<RegExpOrString<schema.infer<S>>> => {
	if (unwrap(tSchema) instanceof schema.ZodString) {
		return schema.union([
			tSchema,
			schema.instanceof(RegExp),
			// schema.instanceof(BSONRegExp), // TODO This requires an explicit dependency on bson.
		]) as any;
	}

	return tSchema;
};

export type FilterOperators<TValue> = {
	// Comparison
	$eq?: TValue;
	$gt?: TValue;
	$gte?: TValue;
	$in?: Array<TValue | null>;
	$lt?: TValue;
	$lte?: TValue;
	$ne?: TValue;
	$nin?: Array<TValue | null>;
	// Logical
	$not?: TValue extends string
		? FilterOperators<TValue> | RegExp
		: FilterOperators<TValue>;
	// Element
	/**
	 * When `true`, `$exists` matches the documents that contain the field,
	 * including documents where the field value is null.
	 */
	$exists?: boolean;
	$type?: BSONType[] | BSONType;
	// Evaluation
	$expr?: Record<string, any>;
	$jsonSchema?: Record<string, any>;
	$mod?: TValue extends number ? [number, number] : never;
	$regex?: TValue extends string ? RegExp | BSONRegExp | string : never;
	$options?: TValue extends string ? string : never;
	// Geospatial
	$geoIntersects?: {$geometry: Document};
	$geoWithin?: Document;
	$near?: Document;
	$nearSphere?: Document;
	$maxDistance?: number;
	// Array
	$all?: TValue extends readonly any[] ? any[] : never;
	$elemMatch?: TValue extends ReadonlyArray<infer U> ? UserFilter<U> : never;
	$size?: TValue extends readonly any[] ? number : never;
	// Bitwise
	$bitsAllClear?: BitwiseFilter;
	$bitsAllSet?: BitwiseFilter;
	$bitsAnyClear?: BitwiseFilter;
	$bitsAnySet?: BitwiseFilter;
	$rand?: Record<string, never>;
};
// } & Document;

export const filterOperators = <S extends schema.ZodTypeAny>(
	tSchema: S,
): schema.ZodType<FilterOperators<schema.infer<S>>> => {
	const s = schema
		.object({
			// Comparison
			$eq: tSchema,
			$gt: tSchema,
			$gte: tSchema,
			$in: schema.array(tSchema.nullable()),
			$lt: tSchema,
			$lte: tSchema,
			$ne: tSchema,
			$nin: schema.array(tSchema.nullable()),
			// Logical
			$not: schema.lazy(() =>
				unwrap(tSchema) instanceof schema.ZodString
					? schema.union(s, schema.instanceof(RegExp))
					: s,
			),
			// Element
			/**
			 * When `true`, `$exists` matches the documents that contain the field,
			 * including documents where the field value is null.
			 */
			$exists: schema.boolean(),
			$type: schema.union([bsonType, schema.array(bsonType)]),
			// Evaluation
			$expr: schema.record(schema.string(), schema.any(/* TODO */)),
			$jsonSchema: schema.record(schema.string(), schema.any()),
			$mod: $mod(tSchema),
			$regex: $regex(tSchema),
			$options: $options(tSchema),
			// Geospatial
			$geoIntersects: schema.object({$geometry: document}).strict(),
			$geoWithin: document,
			$near: document,
			$nearSphere: document,
			$maxDistance: schema.number(),
			// Array
			$all: $all(tSchema),
			$elemMatch: $elemMatch(tSchema),
			$size: $size(tSchema),
			// Bitwise
			$bitsAllClear: bitwiseFilter,
			$bitsAllSet: bitwiseFilter,
			$bitsAnyClear: bitwiseFilter,
			$bitsAnySet: bitwiseFilter,
			$rand: schema.record(schema.string(), schema.never()),
		})
		.partial();

	return s;
};

const unwrap = <S extends schema.ZodTypeAny>(tSchema: S) => {
	if (
		tSchema instanceof schema.ZodOptional ||
		tSchema instanceof schema.ZodBranded
	) {
		return unwrap(tSchema.unwrap());
	}

	return tSchema;
};

const operator =
	<O extends (s: schema.ZodTypeAny) => schema.ZodTypeAny>(op: O) =>
	<S extends schema.ZodTypeAny>(tSchema: S) => {
		tSchema = unwrap(tSchema);

		if (tSchema instanceof schema.ZodUnion) {
			return schema.union(tSchema.options.map(op));
		}

		return op(tSchema);
	};

const $all = operator(<S extends schema.ZodTypeAny>(tSchema: S) => {
	if (tSchema instanceof schema.ZodArray) {
		return schema.array(condition(tSchema.element));
	}

	// TODO Handle tuples.

	return schema.never();
});

const $elemMatch = operator(<S extends schema.ZodTypeAny>(tSchema: S) => {
	if (tSchema instanceof schema.ZodArray) {
		return userFilter(tSchema.element);
	}

	// TODO Handle tuples.

	return schema.never();
});

const $size = operator(<S extends schema.ZodTypeAny>(tSchema: S) => {
	if (
		tSchema instanceof schema.ZodArray ||
		tSchema instanceof schema.ZodTuple
	) {
		return schema.number();
	}

	return schema.never();
});

const $mod = operator(<S extends schema.ZodTypeAny>(tSchema: S) => {
	return tSchema instanceof schema.ZodNumber
		? schema.tuple([schema.number(), schema.number()])
		: schema.never();
});

const $regex = operator(<S extends schema.ZodTypeAny>(tSchema: S) => {
	return tSchema instanceof schema.ZodString
		? schema.union([
				schema.string(),
				schema.instanceof(RegExp),
				// schema.instanceof(BSONRegExp), // TODO This requires an explicit dependency on bson.
		  ])
		: schema.never();
});

const $options = operator(<S extends schema.ZodTypeAny>(tSchema: S) => {
	return tSchema instanceof schema.ZodString ? schema.string() : schema.never();
});

export default UserFilter;
