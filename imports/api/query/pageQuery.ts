import schema from '../../util/schema';
import removeUndefined from '../../util/object/removeUndefined';
import type Collection from '../Collection';
import type Document from '../Document';
import {type AuthenticatedContext} from '../publication/Context';

import {userQuery} from './UserQuery';
import type UserQuery from './UserQuery';
import type Filter from './Filter';
import type Selector from './Selector';
import type Options from './Options';

export const publicationSchema = <S extends schema.ZodTypeAny>(
	tSchema: S,
): schema.ZodTuple<[schema.ZodType<UserQuery<schema.infer<S>>>]> =>
	schema.tuple([userQuery(tSchema)]);

const pageQuery = <T extends Document, U = T>(
	collection: Collection<T, U>,
	filter: Filter<T> | ((ctx: AuthenticatedContext) => Filter<T>),
) =>
	function (query: UserQuery<T>) {
		const selector = {
			...query.filter,
			...(typeof filter === 'function' ? filter(this) : filter),
		} as Selector<T>;
		let {skip, limit} = query;

		if (skip) {
			limit = limit ? skip + limit : undefined;
			skip = 0;
		}

		const options = removeUndefined({
			fields: query.projection,
			sort: query.sort,
			skip,
			limit,
		}) as Options<T>;

		return collection.find(selector, options);
	};

export default pageQuery;
