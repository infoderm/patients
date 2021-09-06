import {DependencyList} from 'react';

import {Mongo} from 'meteor/mongo';
import {useTracker} from 'meteor/react-meteor-data';

import isValid from 'date-fns/isValid';

import {Events, EventDocument} from '../../api/collection/events';
import {beginsInInterval} from '../../api/events';
import subscribe from '../../api/publication/subscribe';
import interval from '../../api/publication/events/interval';

const useEvents = (
	begin: Date,
	end: Date,
	filter: Mongo.Selector<EventDocument>,
	options: Mongo.Options<EventDocument>,
	deps: DependencyList,
) => {
	const query = {
		...beginsInInterval(begin, end),
		...filter,
	};

	return useTracker(() => {
		if (!isValid(begin) || !isValid(end)) return {loading: false, results: []};
		// TODO Do not oversubscribe
		const handle = subscribe(interval, begin, end);
		return {
			loading: !handle.ready(),
			results: Events.find(query, options).fetch(),
		};
	}, deps);
};

export default useEvents;
