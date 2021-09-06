import {useTracker} from 'meteor/react-meteor-data';

import {key, Stats} from '../../api/collection/consultations/stats';
import subscribe from '../../api/publication/subscribe';
import publication from '../../api/publication/consultations/stats';

const useConsultationsStats = (query) =>
	useTracker(() => {
		console.debug({publication, query});

		const handle = subscribe(publication, query);
		const loading = !handle.ready();

		return {
			loading,
			result: loading ? undefined : Stats.findOne(key(query)),
		};
	}, [JSON.stringify(query)]);

export default useConsultationsStats;
