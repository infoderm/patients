import type schema from '../lib/schema';

import type ArgsSchema from './ArgsSchema';

type InferArgs<S extends ArgsSchema> = schema.infer<S>;

export default InferArgs;
