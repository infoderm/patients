import {thisYearsInterval} from '../../util/datetime';
import {findLastConsultationInInterval} from '../../api/consultations';
import useSubscription from '../../api/publication/useSubscription';
import useReactive from '../../api/publication/useReactive';
import last from '../../api/publication/consultations/interval/last';
import type Filter from '../../api/transaction/Filter';
import MeteorTransactionSimulationDriver from '../../api/transaction/MeteorTransactionSimulationDriver';

import {type ConsultationDocument} from '../../api/collection/consultations';

export default function useLastConsultationOfThisYear(
	filter?: Filter<ConsultationDocument>,
) {
	const interval = thisYearsInterval();

	const isLoading = useSubscription(last, ...interval, filter);
	const loading = isLoading();

	const consultation = useReactive(
		() =>
			findLastConsultationInInterval(
				new MeteorTransactionSimulationDriver(),
				interval,
				filter,
			) as unknown as ConsultationDocument,
		[JSON.stringify(interval), JSON.stringify(filter)],
	);

	const found = Boolean(consultation);

	return {
		loading,
		found,
		consultation,
	};
}
