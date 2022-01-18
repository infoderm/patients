import {useTracker} from 'meteor/react-meteor-data';
import {ConsultationDocument} from '../../api/collection/consultations';

import {findLastConsultation} from '../../api/consultations';
import last from '../../api/publication/consultations/last';
import subscribe from '../../api/publication/subscribe';
import MinimongoWrapper from '../../api/transaction/MinimongoWrapper';

export default function useLastConsultation(filter) {
	const db = new MinimongoWrapper();
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
