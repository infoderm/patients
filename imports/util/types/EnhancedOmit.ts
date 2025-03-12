/** TypeScript Omit (Exclude to be specific) does not work for objects with an "any" indexed type, and breaks discriminated unions @public */
type EnhancedOmit<TRecordOrUnion, KeyUnion> =
	string extends keyof TRecordOrUnion
		? TRecordOrUnion // TRecordOrUnion has indexed type e.g. { _id: string; [k: string]: any; } or it is "any"
		: TRecordOrUnion extends any
		? Pick<TRecordOrUnion, Exclude<keyof TRecordOrUnion, KeyUnion>> // discriminated unions
		: never;

export default EnhancedOmit;
