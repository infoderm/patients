import schema from '../../util/schema';

import sort, {type Sort} from './sort';
import {projection} from './Projection';
import type Projection from './Projection';
import {userFilter} from './UserFilter';
import type UserFilter from './UserFilter';

type UserQuery<T> = {
	filter: UserFilter<T>;
	projection?: Projection<T>;
	sort?: Sort<T>;
	skip?: number;
	limit?: number;
};

export const userQuery = <S extends schema.ZodTypeAny>(
	tSchema: S,
): schema.ZodType<UserQuery<schema.infer<S>>> =>
	schema
		.object({
			filter: userFilter(tSchema),
			projection: projection(tSchema).optional(),
			sort: sort(tSchema).optional(),
			skip: schema.number().int().optional(),
			limit: schema.number().int().optional(),
		})
		.strict() as schema.ZodType<UserQuery<schema.infer<S>>>;

export default UserQuery;
