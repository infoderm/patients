import {useTracker} from 'meteor/react-meteor-data';

import {Count} from '../../api/collection/stats';
import subscribe from '../../api/publication/subscribe';

import {countPublicationName, countPublicationKey} from '../../api/stats';

const makeHistogram = (QueriedCollection, values) => (query?: object) => {
	const name = countPublicationName(QueriedCollection, {values});
	const publication = {name};
	const key = countPublicationKey(QueriedCollection, {values}, query);
	return useTracker(() => {
		const handle = subscribe(publication, query);
		const loading = !handle.ready();
		const results = loading ? undefined : Count.findOne(key);
		return {
			loading,
			...results,
		};
	}, [name, key]);
};

export default makeHistogram;
