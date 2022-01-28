import {DependencyList, useRef} from 'react';
import {useTracker} from 'meteor/react-meteor-data';

import Publication from './publication/Publication';
import subscribe from './publication/subscribe';

const init = [];

const makeDebouncedResultsQuery =
	<T, U>(Collection: Mongo.Collection<T, U>, publication: Publication) =>
	(
		query: Mongo.Selector<T>,
		options: Mongo.Options<T>,
		deps: DependencyList,
	) => {
		const ref = useRef(init);

		const loading = useTracker(() => {
			const handle = subscribe(publication, query, options);
			return !handle.ready();
		}, deps);

		const upToDate = useTracker(
			() => Collection.find(query, options).fetch(),
			[loading, ...deps],
		);

		if (!loading) ref.current = upToDate;

		return {
			loading,
			results: ref.current,
		};
	};

export default makeDebouncedResultsQuery;
