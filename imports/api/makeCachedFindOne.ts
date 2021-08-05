import {DependencyList, useRef} from 'react';
import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {useTracker} from 'meteor/react-meteor-data';

const makeCachedFindOne =
	<T, U>(Collection: Mongo.Collection<T, U>, subscription: string) =>
	(
		init: Partial<U>,
		query: Mongo.Selector<T>,
		options: Mongo.Options<T>,
		deps: DependencyList
	) => {
		const ref = useRef(init);

		const loading = useTracker(() => {
			const handle = Meteor.subscribe(subscription, query, options);
			return !handle.ready();
		}, deps);

		const upToDate = useTracker<U>(
			() => (loading ? undefined : Collection.findOne(query, options)),
			[loading, ...deps]
		);

		const found = Boolean(upToDate);
		const fields = {...ref.current, ...upToDate};
		ref.current = fields;

		return {loading, found, fields};
	};

export default makeCachedFindOne;
