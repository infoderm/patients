import type {Binary, Document, BSONRegExp} from 'bson';

/** A MongoDB filter can be some portion of the schema or a set of operators */
type Filter<TSchema> = {
	[P in keyof TSchema]?: Condition<TSchema[P]>;
} & RootFilterOperators<TSchema>;

export default Filter;

type Condition<T> = AlternativeType<T> | FilterOperators<AlternativeType<T>>;

/**
 * It is possible to search using alternative types in mongodb e.g.
 * string types can be searched using a regex in mongo
 * array types can be searched using their element type
 */
type AlternativeType<T> = T extends ReadonlyArray<infer U>
	? T | RegExpOrString<U>
	: RegExpOrString<T>;

type RegExpOrString<T> = T extends string ? BSONRegExp | RegExp | T : T;

type RootFilterOperators<TSchema> = {
	$and?: Array<Filter<TSchema>>;
	$nor?: Array<Filter<TSchema>>;
	$or?: Array<Filter<TSchema>>;
	$text?: {
		$search: string;
		$language?: string;
		$caseSensitive?: boolean;
		$diacriticSensitive?: boolean;
	};
	$where?: string | ((this: TSchema) => boolean);
	$comment?: string | Document;
} & Document;

type FilterOperators<TValue> = {
	// Comparison
	$eq?: TValue;
	$gt?: TValue;
	$gte?: TValue;
	$in?: TValue[];
	$lt?: TValue;
	$lte?: TValue;
	$ne?: TValue;
	$nin?: TValue[];
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
	$type?: BSONType | BSONTypeAlias;
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
	$elemMatch?: TValue extends readonly any[] ? Document : never;
	$size?: TValue extends readonly any[] ? number : never;
	// Bitwise
	$bitsAllClear?: BitwiseFilter;
	$bitsAllSet?: BitwiseFilter;
	$bitsAnyClear?: BitwiseFilter;
	$bitsAnySet?: BitwiseFilter;
	$rand?: Record<string, never>;
} & Document;

type BitwiseFilter =
	| number /** numeric bit mask */
	| Binary /** BinData bit mask */
	| number[]; /** `[ <position1>, <position2>, ... ]` */

const BSONType = Object.freeze({
	double: 1,
	string: 2,
	object: 3,
	array: 4,
	binData: 5,
	undefined: 6,
	objectId: 7,
	bool: 8,
	date: 9,
	null: 10,
	regex: 11,
	dbPointer: 12,
	javascript: 13,
	symbol: 14,
	javascriptWithScope: 15,
	int: 16,
	timestamp: 17,
	long: 18,
	decimal: 19,
	minKey: -1,
	maxKey: 127,
} as const);

// eslint-disable-next-line @typescript-eslint/no-redeclare
type BSONType = (typeof BSONType)[keyof typeof BSONType];
type BSONTypeAlias = keyof typeof BSONType;
