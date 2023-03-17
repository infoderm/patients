import {key as statsKey, Stats} from '../../api/collection/consultations/stats';
import useSubscription from '../../api/publication/useSubscription';
import useItem from '../../api/publication/useItem';
import publication from '../../api/publication/consultations/stats';
import {type ConsultationDocument} from '../../api/collection/consultations';
import type UserFilter from '../../api/query/UserFilter';

const useConsultationsStats = (
	query: UserFilter<ConsultationDocument>,
	skip?: boolean,
) => {
	const isLoading = useSubscription(skip ? null : publication, query);
	const loading = isLoading();
	const key = statsKey(query);

	const result = useItem(
		Boolean(skip) || loading ? null : Stats,
		{_id: key},
		undefined,
		[skip, loading, JSON.stringify(query)],
	);

	const found = Boolean(result);

	return {
		loading,
		found,
		result,
	};
};

export default useConsultationsStats;
