import {type Mongo} from 'meteor/mongo';

import {type ConsultationDocument} from '../../api/collection/consultations';
import {Count} from '../../api/collection/stats';

import publication, {
	frequencySexKey,
	type GenderCount,
} from '../../api/publication/stats/frequencyBySex';
import useReactive from '../../api/publication/useReactive';
import useSubscription from '../../api/publication/useSubscription';

type Result = {
	loading: boolean;
	total?: number;
	count?: GenderCount[];
};

const useFrequencyStats = (
	query?: Mongo.Selector<ConsultationDocument>,
): Result => {
	const key = frequencySexKey(query);

	const isLoading = useSubscription(publication, query);
	const loading = isLoading();

	const results = useReactive(
		() => (loading ? undefined : Count.findOne(key)),
		[loading, key],
	);

	return {
		loading,
		total: results?.total,
		count: results?.count,
	};
};

export default useFrequencyStats;
