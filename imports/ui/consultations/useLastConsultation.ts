import {findLastConsultationSync} from '../../api/consultations';
import useSubscription from '../../api/publication/useSubscription';
import useReactive from '../../api/publication/useReactive';
import last from '../../api/publication/consultations/last';
import type Filter from '../../api/transaction/Filter';

import {type ConsultationDocument} from '../../api/collection/consultations';

type ReturnValue =
	| {loading: boolean; found: false; consultation: undefined}
	| {loading: boolean; found: true; consultation: ConsultationDocument};

export default function useLastConsultation(
	filter?: Filter<ConsultationDocument>,
) {
	const isLoading = useSubscription(last, null);
	const loading = isLoading();

	const consultation = useReactive(
		() => findLastConsultationSync(filter),
		[JSON.stringify(filter)],
	);

	const found = Boolean(consultation);

	return {
		loading,
		found,
		consultation,
	} as ReturnValue;
}
