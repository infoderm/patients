import type schema from '../util/schema';

import type Args from './Args';

type ArgsSchemaFor<A extends Args> = schema.ZodType<A>;

export default ArgsSchemaFor;
