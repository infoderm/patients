import {Meteor} from 'meteor/meteor';
import {useTracker} from 'meteor/react-meteor-data';

import {NoShows} from './noShows';

const useNoShowsForPatient = (patientId) => {
	const loading = useTracker(() => {
		const handle = Meteor.subscribe('patient.noShows', patientId);
		return !handle.ready();
	}, [patientId]);

	const upToDate = useTracker(
		() => (loading ? undefined : NoShows.findOne(patientId)),
		[loading, patientId]
	);

	const found = Boolean(upToDate);

	return {loading, found, value: upToDate?.count};
};

export default useNoShowsForPatient;
