import {Meteor} from 'meteor/meteor';
import {useTracker} from 'meteor/react-meteor-data';

import isValid from 'date-fns/isValid';

import {Events, intersectsInterval} from '../../api/events.js';

const useIntersectingEvents = (begin, end, filter, options, deps) => {
	const query = {
		...intersectsInterval(begin, end),
		...filter
	};

	return useTracker(() => {
		if (!isValid(begin) || !isValid(end)) return {loading: false, results: []};
		// TODO Do not oversubscribe
		const handle = Meteor.subscribe('events.intersects', begin, end);
		return {
			loading: !handle.ready(),
			results: Events.find(query, options).fetch()
		};
	}, deps);
};

export default useIntersectingEvents;
