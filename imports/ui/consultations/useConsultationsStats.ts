import {key, Stats} from '../../api/collection/consultations/stats';
import useSubscription from '../../api/publication/useSubscription';
import useItem from '../../api/publication/useItem';
import publication from '../../api/publication/consultations/stats';
import {type ConsultationDocument} from '../../api/collection/consultations';
import type Selector from '../../api/QuerySelector';

const useConsultationsStats = (query: Selector<ConsultationDocument>) => {
	const isLoading = useSubscription(publication, query);
	const loading = isLoading();

	const result = useItem(loading ? null : Stats, {_id: key(query)}, undefined, [
		loading,
		JSON.stringify(query),
	]);

	const found = Boolean(result);

	return {
		loading,
		found,
		result,
	};
};

export default useConsultationsStats;
