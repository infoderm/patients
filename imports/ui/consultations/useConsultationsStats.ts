import {Meteor} from 'meteor/meteor';
import {useTracker} from 'meteor/react-meteor-data';

import {consultations} from '../../api/consultations';

const {key, publication, Collection} = consultations.stats;

const useConsultationsStats = (query) =>
	useTracker(() => {
		console.debug({publication, query});

		const handle = Meteor.subscribe(publication, query);
		const loading = !handle.ready();

		return {
			loading,
			result: loading ? undefined : Collection.findOne(key(query)),
		};
	}, [JSON.stringify(query)]);

export default useConsultationsStats;
