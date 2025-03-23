import schema from '../../util/schema';

import sort, {type Sort} from './sort';
import {projection} from './Projection';
import type Projection from './Projection';
import type Filter from './Filter';
import {filter} from './Filter';

type Query<T> = {
	filter: Filter<T>;
	projection?: Projection<T>;
	sort?: Sort<T>;
	skip?: number;
	limit?: number;
};

export const query = <S extends schema.ZodTypeAny>(
	tSchema: S,
): schema.ZodType<Query<schema.infer<S>>> =>
	schema
		.object({
			filter: filter(tSchema),
			projection: projection(tSchema).optional(),
			sort: sort(tSchema).optional(),
			skip: schema.number().int().optional(),
			limit: schema.number().int().optional(),
		})
		.strict() as schema.ZodType<Query<schema.infer<S>>>;

export default Query;
