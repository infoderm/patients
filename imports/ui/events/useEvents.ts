import {type DependencyList} from 'react';

import isValid from 'date-fns/isValid';

import {Events, type EventDocument} from '../../api/collection/events';
import {beginsInInterval} from '../../api/events';
import useSubscription from '../../api/publication/useSubscription';
import useCursor from '../../api/publication/useCursor';
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
	// TODO Do not oversubscribe
	const publication = isValid(begin) && isValid(end) ? interval : null;
	const isLoading = useSubscription(publication, begin, end);

	const selector = {
		...beginsInInterval(begin, end),
		...filter,
	};

	const {results} = useCursor(() => Events.find(selector, options), deps);

	return {
		loading: isLoading(),
		results: publication ? results : [],
	};
};

export default useEvents;
