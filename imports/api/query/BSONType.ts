import schema from '../../lib/schema';

const BSONTypeMap = Object.freeze({
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

type BSONTypeKey = keyof typeof BSONTypeMap;
type BSONTypeValue = (typeof BSONTypeMap)[BSONTypeKey];
type BSONType = BSONTypeValue | BSONTypeKey;

export const bsonType: schema.ZodType<BSONType> = schema.union([
	...Object.keys(BSONTypeMap).map((key) => schema.literal(key)),
	...Object.values(BSONTypeMap).map((value) => schema.literal(value)),
] as any);

export default BSONType;
