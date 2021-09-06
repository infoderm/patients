import {useTracker} from 'meteor/react-meteor-data';

import {findLastConsultation} from '../../api/consultations';
import last from '../../api/publication/consultations/last';
import subscribe from '../../api/publication/subscribe';

export default function useLastConsultation(filter) {
	return useTracker(() => {
		const handle = subscribe(last);
		return {
			loading: !handle.ready(),
			consultation: findLastConsultation(filter),
		};
	}, [JSON.stringify(filter)]);
}
