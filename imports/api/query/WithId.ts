import type EnhancedOmit from '../../util/types/EnhancedOmit';

/** Given an object shaped type, return the type of the _id field or default to string @public */
type InferIdType<TSchema> = TSchema extends {_id: infer IdType}
	? // user has defined a type for _id
	  Record<any, never> extends IdType
		? never // explicitly forbid empty objects as the type of _id
		: IdType
	: TSchema extends {_id?: infer IdType}
	? // optional _id defined - return string | IdType
	  unknown extends IdType
		? string // infer the _id type as string if the type of _id is unknown
		: IdType
	: string; // user has not defined _id on schema

/** Add an _id field to an object shaped type @public */
type WithId<TSchema> = EnhancedOmit<TSchema, '_id'> & {
	_id: InferIdType<TSchema>;
};

export default WithId;
