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
	const isLoading = useSubscription(publication, [query], !skip);
	const loadingSubscription = isLoading();
	const key = statsKey(query);

	const {
		loading: loadingResult,
		found,
		result,
	} = useItem(skip ? null : Stats, {_id: key}, undefined, [
		skip,
		loadingSubscription,
		JSON.stringify(query),
	]);

	return {
		loading: loadingSubscription || loadingResult,
		found,
		result,
	};
};

export default useConsultationsStats;
