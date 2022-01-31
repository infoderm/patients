import {useTracker} from 'meteor/react-meteor-data';

import {Count, PollResult} from '../../api/collection/stats';
import subscribe from '../../api/publication/subscribe';

import {countPublicationName, countPublicationKey} from '../../api/stats';

interface Result<T> {
	loading: boolean;
	total?: number;
	count?: T;
}

const makeHistogram =
	<T>(QueriedCollection, values) =>
	(query?: object): Result<T> => {
		const name = countPublicationName(QueriedCollection, {values});
		const publication = {name};
		const key = countPublicationKey(QueriedCollection, {values}, query);
		return useTracker(() => {
			const handle = subscribe(publication, query);
			const loading = !handle.ready();
			const results: PollResult<T> | undefined = loading
				? undefined
				: Count.findOne(key);
			return {
				loading,
				total: results?.total,
				count: results?.count,
			};
		}, [name, key]);
	};

export default makeHistogram;
