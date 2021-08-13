import {DependencyList} from 'react';
import {Meteor} from 'meteor/meteor';
import {useTracker} from 'meteor/react-meteor-data';

const makeQuery =
	<T, U>(Collection: Mongo.Collection<T, U>, subscription: string) =>
	(query: Mongo.Selector<T>, options: Mongo.Options<T>, deps: DependencyList) =>
		useTracker(() => {
			const handle = Meteor.subscribe(subscription, query, options);

			return {
				loading: !handle.ready(),
				results: Collection.find(query, options).fetch(),
			};
		}, deps);

export default makeQuery;
