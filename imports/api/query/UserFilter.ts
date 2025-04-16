import {chain} from '@iterable-iterator/chain';
import {map} from '@iterable-iterator/map';
import {type BSONRegExp} from 'bson';

import schema, {map as mapSchema} from '../../util/schema';
import type Document from '../Document';
import {document} from '../Document'; // TODO Replace this

import removeUndefined from '../../util/object/removeUndefined';

import type WithId from './WithId';
import {
	fieldSpecifiers,
	propertyType,
	type FieldSpecifiers,
	type PropertyType,
} from './dotNotation';
import {bsonType} from './BSONType';
import type BSONType from './BSONType';
import type BitwiseFilter from './BitwiseFilter';
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

export const $text = schema.object({
	$search: schema.string(),
	$language: schema.string().optional(),
	$caseSensitive: schema.boolean().optional(),
	$diacriticSensitive: schema.boolean().optional(),
});

export const $expr = <S extends schema.ZodTypeAny>(
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
type AlternativeType<T> = T extends undefined
	? UndefinedFilter<T>
	: T extends Array<infer U>
	? ArrayFilter<U, T>
	: T extends string
	? StringFilter<T>
	: T extends number
	? NumberFilter<T>
	: T;

type UndefinedFilter<T extends undefined> = null | T;

type ArrayFilter<U, T extends readonly U[] = readonly U[]> = T | Condition<U>;

type StringFilter<T extends string> = BSONRegExp | RegExp | T;

type NumberFilter<T extends number> = T;

export const condition = <S extends schema.ZodTypeAny>(
	tSchema: S,
): schema.ZodType<Condition<schema.infer<S>>> => {
	return schema.union([
		mapSchema(alternativeType, tSchema),
		mapSchema(filterOperators, tSchema),
	]);
};

const alternativeType = <S extends schema.ZodTypeAny>(
	tSchema: S,
): schema.ZodType<AlternativeType<schema.infer<S>>> => {
	if (tSchema instanceof schema.ZodUndefined) {
		return undefinedFilter(tSchema) as schema.ZodType<
			AlternativeType<schema.infer<S>>
		>;
	}

	if (tSchema instanceof schema.ZodArray) {
		return arrayFilter(tSchema) as schema.ZodType<
			AlternativeType<schema.infer<S>>
		>;
	}

	if (tSchema instanceof schema.ZodString) {
		return stringFilter(tSchema) as schema.ZodType<
			AlternativeType<schema.infer<S>>
		>;
	}

	if (tSchema instanceof schema.ZodNumber) {
		return numberFilter(tSchema);
	}

	return tSchema;
};

const undefinedFilter = <S extends schema.ZodUndefined>(
	tSchema: S,
): schema.ZodType<UndefinedFilter<schema.infer<S>>> => {
	return schema.union([tSchema, schema.null()]);
};

const arrayFilter = <U extends schema.ZodTypeAny, S extends schema.ZodArray<U>>(
	tSchema: S,
): schema.ZodType<ArrayFilter<schema.infer<U>, schema.infer<S>>> => {
	return schema.union([tSchema, condition(tSchema.element)]);
};

const stringFilter = <S extends schema.ZodString>(
	tSchema: S,
): schema.ZodType<StringFilter<schema.infer<S>>> => {
	return schema.union([
		tSchema,
		schema.instanceof(RegExp),
		// schema.instanceof(BSONRegExp), // TODO This requires an explicit dependency on bson.
	]);
};

const numberFilter = <S extends schema.ZodNumber>(
	tSchema: S,
): schema.ZodType<NumberFilter<schema.infer<S>>> => {
	return schema.union([tSchema, schema.nan()]);
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
		.object(
			removeUndefined({
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
					unwrap(tSchema)[0] instanceof schema.ZodString
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
			}),
		)
		.partial()
		.strict();

	return s;
};

const unwrap = <S extends schema.ZodTypeAny>(tSchema: S) =>
	_unwrap(tSchema, (x: S) => x);

const _unwrap = <W extends schema.ZodTypeAny, S extends schema.ZodTypeAny = W>(
	tSchema: S,
	wrap: (tSchema: S) => W,
) => {
	if (tSchema instanceof schema.ZodOptional) {
		const [_tSchema, _wrap] = _unwrapOptional(tSchema);
		return [_tSchema, (x: typeof _tSchema) => wrap(_wrap(x))] as const;
	}

	if (tSchema instanceof schema.ZodNullable) {
		const [_tSchema, _wrap] = _unwrapNullable(tSchema);
		return [_tSchema, (x: typeof _tSchema) => wrap(_wrap(x))] as const;
	}

	if (tSchema instanceof schema.ZodBranded) {
		const [_tSchema, _wrap] = _unwrapBranded(tSchema);
		return [_tSchema, (x: typeof _tSchema) => wrap(_wrap(x))] as const;
	}

	return [tSchema, wrap] as const;
};

const _unwrapOptional = <
	S extends schema.ZodOptional<T>,
	T extends schema.ZodTypeAny,
>(
	tSchema: S,
) => {
	return _unwrap(tSchema.unwrap(), (x) => x.nullable());
};

const _unwrapNullable = <
	S extends schema.ZodNullable<T>,
	T extends schema.ZodTypeAny,
>(
	tSchema: S,
) => {
	return _unwrap(tSchema.unwrap(), (x) => x.nullable());
};

const _unwrapBranded = <
	S extends schema.ZodBranded<T, B>,
	T extends schema.ZodTypeAny,
	B extends string,
>(
	tSchema: S,
) => {
	return _unwrap(tSchema.unwrap(), (x) => x.brand<B>());
};

const operator = <
	O extends (s: schema.ZodTypeAny) => schema.ZodTypeAny | undefined,
>(
	op: O,
) => {
	const recurse = <S extends schema.ZodTypeAny>(tSchema: S) => {
		const [_tSchema, wrap] = unwrap(tSchema);

		if (_tSchema instanceof schema.ZodUnion) {
			return wrap(schema.union(_tSchema.options.map(recurse).filter(Boolean)));
		}

		if (_tSchema instanceof schema.ZodIntersection) {
			const left = recurse(_tSchema._def.left);
			const right = recurse(_tSchema._def.right);
			if (left === undefined) return right;
			if (right === undefined) return left;

			return wrap(schema.intersection(left, right));
		}

		return wrap(op(_tSchema));
	};

	return recurse;
};

const $all = operator(<S extends schema.ZodTypeAny>(tSchema: S) => {
	if (tSchema instanceof schema.ZodArray) {
		return schema.array(condition(tSchema.element));
	}

	// TODO Handle tuples.

	return undefined;
});

const $elemMatch = operator(<S extends schema.ZodTypeAny>(tSchema: S) => {
	if (tSchema instanceof schema.ZodAny) return tSchema;

	if (tSchema instanceof schema.ZodArray) {
		return userFilter(tSchema.element);
	}

	// TODO Handle tuples.

	return undefined;
});

const $size = operator(<S extends schema.ZodTypeAny>(tSchema: S) => {
	if (
		tSchema instanceof schema.ZodArray ||
		tSchema instanceof schema.ZodTuple
	) {
		return schema.number();
	}

	return undefined;
});

const $mod = operator(<S extends schema.ZodTypeAny>(tSchema: S) => {
	return tSchema.safeParse(0).success // TODO: Does not work against refinements.
		? schema.tuple([schema.number(), schema.number()])
		: undefined;
});

const $regex = operator(<S extends schema.ZodTypeAny>(tSchema: S) => {
	return tSchema.safeParse('').success // TODO: Does not work against refinements.
		? schema.union([
				schema.string(),
				schema.instanceof(RegExp),
				// schema.instanceof(BSONRegExp), // TODO This requires an explicit dependency on bson.
		  ])
		: undefined;
});

const $options = operator(<S extends schema.ZodTypeAny>(tSchema: S) => {
	return tSchema.safeParse('').success // TODO: Does not work against refinements.
		? schema.string()
		: undefined;
});

export default UserFilter;
