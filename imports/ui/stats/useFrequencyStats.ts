import {Mongo} from 'meteor/mongo';
import {useTracker} from 'meteor/react-meteor-data';

import {ConsultationDocument} from '../../api/collection/consultations';
import {Count} from '../../api/collection/stats';

import publication, {
	frequencySexKey,
	GenderCount,
} from '../../api/publication/stats/frequencyBySex';
import subscribe from '../../api/publication/subscribe';

interface Result {
	loading: boolean;
	total?: number;
	count?: GenderCount[];
}

const useFrequencyStats = (
	query?: Mongo.Selector<ConsultationDocument>,
): Result => {
	const key = frequencySexKey(query);
	return useTracker(() => {
		const handle = subscribe(publication, query);
		const loading = !handle.ready();
		const results = loading ? undefined : Count.findOne(key);
		return {
			loading,
			total: results?.total,
			count: results?.count,
		};
	}, [key]);
};

export default useFrequencyStats;
