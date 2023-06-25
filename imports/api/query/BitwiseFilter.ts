import {type Binary} from 'bson';

import schema from '../../lib/schema';

type BitwiseFilter =
	| number /** numeric bit mask */
	| Binary /** BinData bit mask */
	| number[]; /** `[ <position1>, <position2>, ... ]` */

export const bitwiseFilter = schema.union([
	schema.number(),
	// schema.instanceof(Binary), // TODO This requires an explicit dependency on bson.
	schema.tuple([schema.number(), schema.number()], schema.number()),
]);

export default BitwiseFilter;
