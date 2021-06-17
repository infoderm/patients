import {Meteor} from 'meteor/meteor';
import {useTracker} from 'meteor/react-meteor-data';

import {
	Count,
	countPublicationName,
	countPublicationKey
} from '../../api/stats.js';

const makeHistogram = (QueriedCollection, values) => (query?: object) => {
	const publication = countPublicationName(QueriedCollection, {values});
	const key = countPublicationKey(QueriedCollection, {values}, query);
	return useTracker(() => {
		const handle = Meteor.subscribe(publication, query);
		const loading = !handle.ready();
		const results = loading ? undefined : Count.findOne(key);
		return {
			loading,
			...results
		};
	}, [publication, key]);
};

export default makeHistogram;
