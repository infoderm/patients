import {Count, type PollResult} from '../../api/collection/stats';
import useSubscription from '../../api/publication/useSubscription';
import useReactive from '../../api/publication/useReactive';

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

		const results: PollResult<T> | undefined = useReactive(() => {
			return loading ? undefined : Count.findOne(key);
		}, [loading, key]);

		return {
			loading,
			total: results?.total,
			count: results?.count,
		};
	};

export default makeHistogram;
