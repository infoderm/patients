import {NoShows} from './collection/noShows';
import noShows from './publication/patient/noShows';
import useSubscription from './publication/useSubscription';
import useReactive from './publication/useReactive';

const useNoShowsForPatient = (patientId: string) => {
	const isLoading = useSubscription(noShows, patientId);
	const loading = isLoading();

	const upToDate = useReactive(
		() => (loading ? undefined : NoShows.findOne(patientId)),
		[loading, patientId],
	);

	const found = Boolean(upToDate);

	return {loading, found, value: upToDate?.count};
};

export default useNoShowsForPatient;
