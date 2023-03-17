import {thisYearsInterval} from '../../lib/datetime';
import {findLastConsultationInIntervalSync} from '../../api/consultations';
import useSubscription from '../../api/publication/useSubscription';
import useReactive from '../../api/publication/useReactive';
import last from '../../api/publication/consultations/interval/last';
import type Filter from '../../api/query/Filter';

import {type ConsultationDocument} from '../../api/collection/consultations';

export default function useLastConsultationOfThisYear(
	filter?: Filter<ConsultationDocument>,
) {
	const interval = thisYearsInterval();

	const isLoading = useSubscription(last, ...interval, filter ?? null);
	const loading = isLoading();

	const consultation = useReactive(
		() => findLastConsultationInIntervalSync(interval, filter),
		[JSON.stringify(interval), JSON.stringify(filter)],
	);

	const found = Boolean(consultation);

	return {
		loading,
		found,
		consultation,
	};
}
