import {findLastConsultation} from '../../api/consultations';
import useSubscription from '../../api/publication/useSubscription';
import useReactive from '../../api/publication/useReactive';
import last from '../../api/publication/consultations/last';
import type Filter from '../../api/transaction/Filter';
import MeteorTransactionSimulationDriver from '../../api/transaction/MeteorTransactionSimulationDriver';

import {type ConsultationDocument} from '../../api/collection/consultations';

export default function useLastConsultation(
	filter?: Filter<ConsultationDocument>,
) {
	const isLoading = useSubscription(last);
	const loading = isLoading();

	const consultation = useReactive(
		() =>
			findLastConsultation(
				new MeteorTransactionSimulationDriver(),
				filter,
			) as unknown as ConsultationDocument,
		[JSON.stringify(filter)],
	);

	const found = Boolean(consultation);

	return {
		loading,
		found,
		consultation,
	};
}
