import {useTracker} from 'meteor/react-meteor-data';
import {type ConsultationDocument} from '../../api/collection/consultations';

import {findLastConsultation} from '../../api/consultations';
import last from '../../api/publication/consultations/last';
import subscribe from '../../api/publication/subscribe';
import type Filter from '../../api/transaction/Filter';
import MeteorTransactionSimulationDriver from '../../api/transaction/MeteorTransactionSimulationDriver';

export default function useLastConsultation(
	filter?: Filter<ConsultationDocument>,
) {
	const db = new MeteorTransactionSimulationDriver();
	return useTracker(() => {
		const handle = subscribe(last);
		const loading = !handle.ready();
		const consultation = findLastConsultation(
			db,
			filter,
		) as unknown as ConsultationDocument;
		const found = Boolean(consultation);
		return {
			loading,
			found,
			consultation,
		};
	}, [JSON.stringify(filter)]);
}
