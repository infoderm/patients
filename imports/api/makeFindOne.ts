import {DependencyList} from 'react';
import {Meteor} from 'meteor/meteor';
import {useTracker} from 'meteor/react-meteor-data';

const makeFindOne =
	<T, U>(Collection: Mongo.Collection<T, U>, subscription: string) =>
	(
		init: Partial<U>,
		query: Mongo.Selector<T> | string,
		options: Mongo.Options<T>,
		deps: DependencyList,
	) => {
		const loading = useTracker(() => {
			const handle = Meteor.subscribe(subscription, query, options);
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
