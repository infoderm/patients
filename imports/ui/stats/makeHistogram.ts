import {Count, type PollResult} from '../../api/collection/stats';
import useSubscription from '../../api/publication/useSubscription';
import useItem from '../../api/publication/useItem';

import {countPublicationName, countPublicationKey} from '../../api/stats';
import type Collection from '../../api/Collection';
import type Publication from '../../api/publication/Publication';
import type Filter from '../../api/QueryFilter';

type Result<T> = {
	loading: boolean;
	total?: number;
	count?: T;
};

const makeHistogram = <C, T = any, U = T>(
	QueriedCollection: Collection<T, U>,
	values: string[],
) => {
	const name = countPublicationName(QueriedCollection, {values});
	const publication: Publication<[Filter<T> | null]> = {name};
	return (query?: Filter<T>): Result<C> => {
		const key = countPublicationKey(QueriedCollection, {values}, query);

		const isLoading = useSubscription(publication, query ?? null);
		const loading = isLoading();

		const results: PollResult<C> | undefined = useItem(
			loading ? null : Count,
			{_id: key},
			undefined,
			[loading, key],
		);

		return {
			loading,
			total: results?.total,
			count: results?.count,
		};
	};
};

export default makeHistogram;
