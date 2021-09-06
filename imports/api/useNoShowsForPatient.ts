import {useTracker} from 'meteor/react-meteor-data';

import {NoShows} from './collection/noShows';
import noShows from './publication/patient/noShows';
import subscribe from './publication/subscribe';

const useNoShowsForPatient = (patientId: string) => {
	const loading = useTracker(() => {
		const handle = subscribe(noShows, patientId);
		return !handle.ready();
	}, [patientId]);

	const upToDate = useTracker(
		() => (loading ? undefined : NoShows.findOne(patientId)),
		[loading, patientId],
	);

	const found = Boolean(upToDate);

	return {loading, found, value: upToDate?.count};
};

export default useNoShowsForPatient;
