import {Meteor} from 'meteor/meteor';
import {useTracker} from 'meteor/react-meteor-data';

import {findLastConsultation} from '../../api/consultations';

export default function useLastConsultation(filter) {
	return useTracker(() => {
		const handle = Meteor.subscribe('consultations.last');
		return {
			loading: !handle.ready(),
			consultation: findLastConsultation(filter)
		};
	}, [JSON.stringify(filter)]);
}
