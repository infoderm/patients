import {Meteor} from 'meteor/meteor';
import {useTracker} from 'meteor/react-meteor-data';

import {
	Count,
	countPublicationName,
	countPublicationKey
} from '../../api/stats.js';

const useHistogram = (QueriedCollection, values) => {
	const publication = countPublicationName(QueriedCollection, {values});
	const key = countPublicationKey(QueriedCollection, {values});
	return useTracker(() => {
		const handle = Meteor.subscribe(publication);
		const loading = !handle.ready();
		const results = loading ? undefined : Count.findOne(key);
		return {
			loading,
			...results
		};
	});
};

export default useHistogram;
