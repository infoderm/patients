import {key, Stats} from '../../api/collection/consultations/stats';
import useSubscription from '../../api/publication/useSubscription';
import useReactive from '../../api/publication/useReactive';
import publication from '../../api/publication/consultations/stats';

const useConsultationsStats = (query) => {
	const isLoading = useSubscription(publication, query);
	const loading = isLoading();

	const result = useReactive(
		() => (loading ? undefined : Stats.findOne(key(query))),
		[loading, JSON.stringify(query)],
	);

	const found = Boolean(result);

	return {
		loading,
		found,
		result,
	};
};

export default useConsultationsStats;
