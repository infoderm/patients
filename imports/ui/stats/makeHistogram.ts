import {Count, type PollResult} from '../../api/collection/stats';
import useSubscription from '../../api/publication/useSubscription';
import useItem from '../../api/publication/useItem';

import {countPublicationName, countPublicationKey} from '../../api/stats';

type Result<T> = {
	loading: boolean;
	total?: number;
	count?: T;
};

const makeHistogram =
	<T>(QueriedCollection, values) =>
	(query?: object): Result<T> => {
		const name = countPublicationName(QueriedCollection, {values});
		const publication = {name};
		const key = countPublicationKey(QueriedCollection, {values}, query);

		const isLoading = useSubscription(publication, query);
		const loading = isLoading();

		const results: PollResult<T> | undefined = useItem(
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

export default makeHistogram;
