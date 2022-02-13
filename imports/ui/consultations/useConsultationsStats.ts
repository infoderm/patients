import {useTracker} from 'meteor/react-meteor-data';

import {key, Stats} from '../../api/collection/consultations/stats';
import subscribe from '../../api/publication/subscribe';
import publication from '../../api/publication/consultations/stats';

const useConsultationsStats = (query) =>
	useTracker(() => {
		console.debug({publication, query});

		const handle = subscribe(publication, query);
		const loading = !handle.ready();
		const result = loading ? undefined : Stats.findOne(key(query));
		const found = Boolean(result);

		return {
			loading,
			found,
			result,
		};
	}, [JSON.stringify(query)]);

export default useConsultationsStats;
