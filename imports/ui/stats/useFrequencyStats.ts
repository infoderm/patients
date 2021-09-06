import {Meteor} from 'meteor/meteor';
import {useTracker} from 'meteor/react-meteor-data';

import {Count} from '../../api/collection/stats';
import {frequencySexPublication, frequencySexKey} from '../../api/stats';

const useFrequencyStats = (query) => {
	const publication = frequencySexPublication;
	const key = frequencySexKey(query);
	return useTracker(() => {
		const handle = Meteor.subscribe(publication, query);
		const loading = !handle.ready();
		const results = loading ? undefined : Count.findOne(key);
		return {
			loading,
			...results,
		};
	}, [publication, key]);
};

export default useFrequencyStats;
