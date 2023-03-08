import type schema from '../lib/schema';
import type ArgSchema from './ArgSchema';

type ArgsSchema = schema.ZodTuple<[] | [ArgSchema, ...ArgSchema[]]>;

export default ArgsSchema;
