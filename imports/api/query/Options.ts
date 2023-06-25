import {type Mongo} from 'meteor/mongo';

import schema from '../../lib/schema';

import {projection} from './Projection';
import sort from './sort';

/**
 * @deprecated Use queryToSelectorOptionsPair instead.
 */
type Options<T> = Pick<Mongo.Options<T>, 'fields' | 'sort' | 'skip' | 'limit'>;

/**
 * @deprecated Use userFilter instead.
 */
export const options = <S extends schema.ZodTypeAny>(
	tSchema: S,
): schema.ZodType<Options<schema.infer<S>>> =>
	schema
		.object({
			fields: projection(tSchema).optional(),
			sort: sort(tSchema).optional(),
			skip: schema.number().int().optional(),
			limit: schema.number().int().optional(),
		})
		.strict() as schema.ZodType<Options<schema.infer<S>>>;

export default Options;
