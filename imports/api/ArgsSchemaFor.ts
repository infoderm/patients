import type schema from '../lib/schema';
import type Args from './Args';

type ArgsSchemaFor<A extends Args> = schema.ZodType<A>;

export default ArgsSchemaFor;
