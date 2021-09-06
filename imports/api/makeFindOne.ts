import {DependencyList} from 'react';
import {useTracker} from 'meteor/react-meteor-data';
import Publication from './publication/Publication';
import subscribe from './publication/subscribe';

const makeFindOne =
	<T, U>(Collection: Mongo.Collection<T, U>, publication: Publication) =>
	(
		init: Partial<U>,
		query: Mongo.Selector<T> | string,
		options: Mongo.Options<T>,
		deps: DependencyList,
	) => {
		const loading = useTracker(() => {
			const handle = subscribe(publication, query, options);
			return !handle.ready();
		}, deps);

		const upToDate = useTracker(
			() => (loading ? undefined : Collection.findOne(query, options)),
			[loading, ...deps],
		);

		const found = Boolean(upToDate);

		const fields = {...init, ...upToDate};

		return {loading, found, fields};
	};

export default makeFindOne;
