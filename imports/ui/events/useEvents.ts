import {type DependencyList} from 'react';

import isValid from 'date-fns/isValid';

import {Events, type EventDocument} from '../../api/collection/events';
import {beginsInInterval} from '../../api/events';
import useQuery from '../../api/publication/useQuery';
import interval from '../../api/publication/events/interval';
import type Selector from '../../api/query/Selector';
import type Options from '../../api/query/Options';

const useEvents = (
	begin: Date,
	end: Date,
	filter: Selector<EventDocument>,
	options: Options<EventDocument>,
	deps: DependencyList,
) => {
	// TODO: Do not oversubscribe
	const enabled = isValid(begin) && isValid(end);

	const selector = {
		...beginsInInterval(begin, end),
		...filter,
	};

	const {loading, results} = useQuery(
		interval,
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

export default useEvents;
