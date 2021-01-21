import {Meteor} from 'meteor/meteor';
import {useTracker} from 'meteor/react-meteor-data';

const makeQuery = (Collection, subscription) => (query, options, deps) => {
	return useTracker(() => {
		const handle = Meteor.subscribe(subscription, query, options);

		return {
			loading: !handle.ready(),
			results: Collection.find(query, options).fetch()
		};
	}, deps);
};

export default makeQuery;
