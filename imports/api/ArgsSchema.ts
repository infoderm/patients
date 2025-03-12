import type schema from '../util/schema';

import type ArgSchema from './ArgSchema';

type ArgsSchema = schema.ZodTuple<[] | [ArgSchema, ...ArgSchema[]]>;

export default ArgsSchema;
