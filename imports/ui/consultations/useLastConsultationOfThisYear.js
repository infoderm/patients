import {Meteor} from 'meteor/meteor';
import {useTracker} from 'meteor/react-meteor-data';

import {thisYearsInterval} from '../../util/datetime.js';
import {findLastConsultationInInterval} from '../../api/consultations.js';

export default function useLastConsultationOfThisYear(filter) {
	const interval = thisYearsInterval();

	return useTracker(() => {
		const handle = Meteor.subscribe(
			'consultations.interval.last',
			...interval,
			filter
		);
		return {
			loading: !handle.ready(),
			consultation: findLastConsultationInInterval(interval, filter)
		};
	}, [JSON.stringify(interval), JSON.stringify(filter)]);
}
