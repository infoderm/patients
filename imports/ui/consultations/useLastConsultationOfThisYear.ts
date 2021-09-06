import {useTracker} from 'meteor/react-meteor-data';

import {thisYearsInterval} from '../../util/datetime';
import {findLastConsultationInInterval} from '../../api/consultations';
import subscribe from '../../api/publication/subscribe';
import last from '../../api/publication/consultations/interval/last';

export default function useLastConsultationOfThisYear(filter) {
	const interval = thisYearsInterval();

	return useTracker(() => {
		const handle = subscribe(last, ...interval, filter);
		return {
			loading: !handle.ready(),
			consultation: findLastConsultationInInterval(interval, filter),
		};
	}, [JSON.stringify(interval), JSON.stringify(filter)]);
}
