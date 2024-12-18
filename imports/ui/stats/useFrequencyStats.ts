import {type ConsultationDocument} from '../../api/collection/consultations';
import {Count} from '../../api/collection/stats';

import publication, {
	frequencySexKey,
	type GenderCount,
} from '../../api/publication/stats/frequencyBySex';
import useItem from '../../api/publication/useItem';
import useSubscription from '../../api/publication/useSubscription';
import type Filter from '../../api/query/Filter';

type Result = {
	loading: boolean;
	total?: number;
	count?: GenderCount[];
};

const useFrequencyStats = (filter?: Filter<ConsultationDocument>): Result => {
	const key = frequencySexKey(filter);

	const isLoading = useSubscription(publication, filter ?? null);
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

export default useFrequencyStats;
