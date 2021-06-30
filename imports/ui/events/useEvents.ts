import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {useTracker} from 'meteor/react-meteor-data';

import isValid from 'date-fns/isValid';

import {Events, Event, beginsInInterval} from '../../api/events';

const useEvents = (
	begin: Date,
	end: Date,
	filter: Mongo.Selector<Event>,
	options: Mongo.Options<Event>,
	deps: any[]
) => {
	const query = {
		...beginsInInterval(begin, end),
		...filter
	};

	return useTracker(() => {
		if (!isValid(begin) || !isValid(end)) return {loading: false, results: []};
		// TODO Do not oversubscribe
		const handle = Meteor.subscribe('events.interval', begin, end);
		return {
			loading: !handle.ready(),
			results: Events.find(query, options).fetch()
		};
	}, deps);
};

export default useEvents;
