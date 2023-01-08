import {useTracker} from 'meteor/react-meteor-data';

import {thisYearsInterval} from '../../util/datetime';
import {findLastConsultationInInterval} from '../../api/consultations';
import subscribe from '../../api/publication/subscribe';
import last from '../../api/publication/consultations/interval/last';
import MeteorTransactionSimulationDriver from '../../api/transaction/MeteorTransactionSimulationDriver';
import {type ConsultationDocument} from '../../api/collection/consultations';

export default function useLastConsultationOfThisYear(filter) {
	const interval = thisYearsInterval();

	const db = new MeteorTransactionSimulationDriver();

	return useTracker(() => {
		const handle = subscribe(last, ...interval, filter);
		return {
			loading: !handle.ready(),
			consultation: findLastConsultationInInterval(
				db,
				interval,
				filter,
			) as unknown as ConsultationDocument,
		};
	}, [JSON.stringify(interval), JSON.stringify(filter)]);
}
