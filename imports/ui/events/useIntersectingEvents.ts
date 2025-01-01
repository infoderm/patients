import {type DependencyList} from 'react';

import isValid from 'date-fns/isValid';

import {Events, type EventDocument} from '../../api/collection/events';
import {intersectsInterval} from '../../api/events';
import intersects from '../../api/publication/events/intersects';
import type Selector from '../../api/query/Selector';
import type Options from '../../api/query/Options';
import useQuery from '../../api/publication/useQuery';

const useIntersectingEvents = (
	begin: Date,
	end: Date,
	filter: Selector<EventDocument>,
	options: Options<EventDocument>,
	deps: DependencyList,
) => {
	// TODO Do not oversubscribe
	const enabled = isValid(begin) && isValid(end);

	const selector = {
		...intersectsInterval(begin, end),
		...filter,
	};

	const {loading, results} = useQuery(
		intersects,
		[begin, end],
		() => Events.find(selector, options),
		deps,
		enabled,
	);

	return {
		loading,
		results: enabled ? results : [],
	};
};

export default useIntersectingEvents;
