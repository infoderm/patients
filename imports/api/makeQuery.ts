import {Mongo} from 'meteor/mongo';
import {DependencyList} from 'react';
import {useTracker} from 'meteor/react-meteor-data';

import Publication from './publication/Publication';
import subscribe from './publication/subscribe';

const makeQuery =
	<T, U>(Collection: Mongo.Collection<T, U>, publication: Publication) =>
	(query: Mongo.Selector<T>, options: Mongo.Options<T>, deps: DependencyList) =>
		useTracker(() => {
			const handle = subscribe(publication, query, options);

			return {
				loading: !handle.ready(),
				results: Collection.find(query, options).fetch(),
			};
		}, deps);

export default makeQuery;
