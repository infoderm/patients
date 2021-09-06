import {useTracker} from 'meteor/react-meteor-data';

import {Count} from '../../api/collection/stats';
import publication, {
	frequencySexKey,
} from '../../api/publication/stats/frequencyBySex';
import subscribe from '../../api/publication/subscribe';

const useFrequencyStats = (query) => {
	const key = frequencySexKey(query);
	return useTracker(() => {
		const handle = subscribe(publication, query);
		const loading = !handle.ready();
		const results = loading ? undefined : Count.findOne(key);
		return {
			loading,
			...results,
		};
	}, [key]);
};

export default useFrequencyStats;
