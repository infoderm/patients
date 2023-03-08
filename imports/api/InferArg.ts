import type schema from '../lib/schema';
import type ArgSchema from './ArgSchema';

type InferArg<T extends ArgSchema> = schema.infer<T>;

export default InferArg;
