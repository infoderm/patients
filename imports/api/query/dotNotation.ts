/**
 * Helper types for dot-notation filter attributes
 */
// @ts-expect-error Needs more recent @types/node
import {type Buffer} from 'buffer';

import schema, {at, keyof} from '../../util/schema';

/** @public */
type Join<T extends unknown[], D extends string> = T extends []
	? ''
	: T extends [string | number]
	? `${T[0]}`
	: T extends [string | number, ...infer R]
	? `${T[0]}${D}${Join<R, D>}`
	: string;

/** @public */
export type PropertyType<TSchema, P extends string> = string extends P
	? unknown
	: P extends keyof TSchema
	? TSchema[P]
	: P extends `${number}`
	? TSchema extends ReadonlyArray<infer ArrayType>
		? ArrayType
		: unknown
	: P extends `${infer Key}.${infer Rest}`
	? Key extends `${number}`
		? TSchema extends ReadonlyArray<infer ArrayType>
			? PropertyType<ArrayType, Rest>
			: unknown
		: Key extends keyof TSchema
		? TSchema[Key] extends Map<string, infer MapType>
			? MapType
			: PropertyType<TSchema[Key], Rest>
		: unknown
	: unknown;

export const _propertyType = <S extends schema.ZodTypeAny, P extends string[]>(
	tSchema: S,
	path: P,
) => {
	if (path.length === 0) {
		return tSchema;
	}

	const [first, ...rest] = path;
	return _propertyType(at(tSchema, schema.literal(first!) as any), rest);
};

export const propertyType = <S extends schema.ZodTypeAny, P extends string>(
	tSchema: S,
	path: P,
): PropertyType<schema.infer<S>, P> => _propertyType(tSchema, path.split('.'));

/**
 * @public
 * returns tuple of strings (keys to be joined on '.') that represent every path into a schema
 * https://www.mongodb.com/docs/manual/tutorial/query-embedded-documents/
 *
 * @remarks
 * Through testing we determined that a depth of 8 is safe for the typescript compiler
 * and provides reasonable compilation times. This number is otherwise not special and
 * should be changed if issues are found with this level of checking. Beyond this
 * depth any helpers that make use of NestedPaths should devolve to not asserting any
 * type safety on the input.
 */
type NestedPaths<Type, Depth extends number[]> = Depth['length'] extends 3
	? []
	: Type extends
			| string
			| number
			| bigint
			| boolean
			| Date
			| RegExp
			| Buffer
			| Uint8Array
			| ((...args: any[]) => any)
			| {_bsontype: string}
	? []
	: Type extends ReadonlyArray<infer ArrayType>
	? [] | [number, ...NestedPaths<ArrayType, [...Depth, 1]>]
	: Type extends Map<string, any>
	? [string]
	: Type extends object
	? {
			[Key in Extract<keyof Type, string>]: Type[Key] extends Type // type of value extends the parent
				? [Key]
				: // for a recursive union type, the child will never extend the parent type.
				// but the parent will still extend the child
				Type extends Type[Key]
				? [Key]
				: Type[Key] extends ReadonlyArray<infer ArrayType> // handling recursive types with arrays
				? Type extends ArrayType // is the type of the parent the same as the type of the array?
					? [Key] // yes, it's a recursive array type
					: // for unions, the child type extends the parent
					ArrayType extends Type
					? [Key] // we have a recursive array union
					: // child is an array, but it's not a recursive array
					  [Key, ...NestedPaths<Type[Key], [...Depth, 1]>]
				: // child is not structured the same as the parent
				  [Key, ...NestedPaths<Type[Key], [...Depth, 1]>] | [Key];
	  }[Extract<keyof Type, string>]
	: [];

export type FieldSpecifiers<TSchema> = Join<NestedPaths<TSchema, []>, '.'>;

export const _fieldSpecifiers = function* <S extends schema.ZodTypeAny>(
	tSchema: S,
): Iterable<string[]> {
	if (tSchema instanceof schema.ZodOptional) {
		tSchema = tSchema.unwrap();
	}

	if (tSchema instanceof schema.ZodObject) {
		const keys: any = keyof(tSchema).options;
		for (const key of keys) {
			yield [key];
			const value = at(tSchema, schema.literal(key));
			for (const path of _fieldSpecifiers(value)) {
				yield [key, ...path];
			}
		}
	} else if (tSchema instanceof schema.ZodUnion) {
		for (const specifiers of tSchema.options.map(_fieldSpecifiers)) {
			yield* specifiers;
		}
	} else if (tSchema instanceof schema.ZodIntersection) {
		for (const specifiers of [tSchema._def.left, tSchema._def.right].map(
			_fieldSpecifiers,
		)) {
			yield* specifiers;
		}
	}
};

export const fieldSpecifiers = <S extends schema.ZodTypeAny>(
	tSchema: S,
): FieldSpecifiers<schema.infer<typeof tSchema>> =>
	Array.from(
		new Set(
			Array.from(_fieldSpecifiers(tSchema)).map((path) => path.join('.')),
		),
	) as any;
