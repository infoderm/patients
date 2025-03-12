import type schema from '../util/schema';

import type ArgSchema from './ArgSchema';

type InferArg<T extends ArgSchema> = schema.infer<T>;

export default InferArg;
