import {Count} from '../../api/collection/stats';
import useSubscription from '../../api/publication/useSubscription';
import useItem from '../../api/publication/useItem';

import {countPublicationName, countPublicationKey} from '../../api/stats';
import type Collection from '../../api/Collection';
import type Document from '../../api/Document';
import type PublicationEndpoint from '../../api/publication/PublicationEndpoint';
import type UserFilter from '../../api/query/UserFilter';

type Result<T> = {
	loading: boolean;
	total?: number;
	count?: T;
};

const makeHistogram = <C, T extends Document = any, U = T>(
	QueriedCollection: Collection<T, U>,
	values: string[],
) => {
	const name = countPublicationName(QueriedCollection, {values});
	const publication: PublicationEndpoint<[UserFilter<T> | null]> = {name};
	return (query?: UserFilter<T>): Result<C> => {
		const key = countPublicationKey(QueriedCollection, {values}, query);

		const isLoading = useSubscription(publication, query ?? null);
		const loadingSubscription = isLoading();

		const {loading: loadingResult, result} = useItem(
			loadingSubscription ? null : Count,
			{_id: key},
			undefined,
			[loadingSubscription, key],
		);

		return {
			loading: loadingSubscription || loadingResult,
			total: result?.total,
			count: result?.count,
		};
	};
};

export default makeHistogram;
