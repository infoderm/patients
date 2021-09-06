import {useTracker} from 'meteor/react-meteor-data';

import isValid from 'date-fns/isValid';

import {Events} from '../../api/collection/events';
import {intersectsInterval} from '../../api/events';
import subscribe from '../../api/publication/subscribe';
import intersects from '../../api/publication/events/intersects';

const useIntersectingEvents = (
	begin: Date,
	end: Date,
	filter,
	options,
	deps,
) => {
	const query = {
		...intersectsInterval(begin, end),
		...filter,
	};

	return useTracker(() => {
		if (!isValid(begin) || !isValid(end)) return {loading: false, results: []};
		// TODO Do not oversubscribe
		const handle = subscribe(intersects, begin, end);
		return {
			loading: !handle.ready(),
			results: Events.find(query, options).fetch(),
		};
	}, deps);
};

export default useIntersectingEvents;
