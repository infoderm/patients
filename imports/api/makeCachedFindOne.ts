import {DependencyList, useRef} from 'react';
import {Mongo} from 'meteor/mongo';
import {useTracker} from 'meteor/react-meteor-data';
import Publication from './publication/Publication';
import subscribe from './publication/subscribe';

const makeCachedFindOne =
	<T, U>(Collection: Mongo.Collection<T, U>, publication: Publication) =>
	(
		init: Partial<U>,
		query: Mongo.Selector<T> | string,
		options: Mongo.Options<T>,
		deps: DependencyList,
	) => {
		const ref = useRef(init);

		const loading = useTracker(() => {
			const handle = subscribe(publication, query, options);
			return !handle.ready();
		}, deps);

		const upToDate = useTracker<U>(
			() => (loading ? undefined : Collection.findOne(query, options)),
			[loading, ...deps],
		);

		const found = Boolean(upToDate);
		const fields = {...ref.current, ...upToDate};
		ref.current = fields;

		return {loading, found, fields};
	};

export default makeCachedFindOne;
