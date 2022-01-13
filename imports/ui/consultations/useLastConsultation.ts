import {useTracker} from 'meteor/react-meteor-data';
import {ConsultationDocument} from '../../api/collection/consultations';

import {findLastConsultation} from '../../api/consultations';
import last from '../../api/publication/consultations/last';
import subscribe from '../../api/publication/subscribe';
import MeteorTransactionSimulationDriver from '../../api/transaction/MeteorTransactionSimulationDriver';

export default function useLastConsultation(filter) {
	const db = new MeteorTransactionSimulationDriver();
	return useTracker(() => {
		const handle = subscribe(last);
		return {
			loading: !handle.ready(),
			consultation: findLastConsultation(
				db,
				filter,
			) as unknown as ConsultationDocument,
		};
	}, [JSON.stringify(filter)]);
}
