import {type DependencyList} from 'react';

import {type Mongo} from 'meteor/mongo';
import {useTracker} from 'meteor/react-meteor-data';

import isValid from 'date-fns/isValid';

import subscribe from '../../api/publication/subscribe';
import {
	Availability,
	type SlotDocument,
} from '../../api/collection/availability';
import intersectsInterval from '../../api/interval/intersectsInterval';
import intersects from '../../api/publication/availability/intersects';

const useAvailability = (
	begin: Date,
	end: Date,
	filter: Mongo.Selector<SlotDocument>,
	options: Mongo.Options<SlotDocument>,
	deps: DependencyList,
) => {
	const query = {
		...intersectsInterval(begin, end),
		...filter,
	};

	return useTracker(() => {
		if (!isValid(begin) || !isValid(end)) return {loading: false, results: []};
		// TODO Do not oversubscribe
		const handle = subscribe(intersects, begin, end, filter);
		return {
			loading: !handle.ready(),
			results: Availability.find(query, options).fetch(),
		};
	}, deps);
};

export default useAvailability;
