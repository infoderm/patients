import {type DependencyList} from 'react';

import isValid from 'date-fns/isValid';

import {Events, type EventDocument} from '../../api/collection/events';
import {intersectsInterval} from '../../api/events';
import useSubscription from '../../api/publication/useSubscription';
import useCursor from '../../api/publication/useCursor';
import intersects from '../../api/publication/events/intersects';
import type Selector from '../../api/query/Selector';
import type Options from '../../api/query/Options';

const useIntersectingEvents = (
	begin: Date,
	end: Date,
	filter: Selector<EventDocument>,
	options: Options<EventDocument>,
	deps: DependencyList,
) => {
	// TODO Do not oversubscribe
	const publication = isValid(begin) && isValid(end) ? intersects : null;
	const isLoading = useSubscription(publication, begin, end);
	const loadingPublication = isLoading();

	const selector = {
		...intersectsInterval(begin, end),
		...filter,
	};

	const {loading: loadingResults, results} = useCursor(() => Events.find(selector, options), deps);

	const loading = loadingPublication || loadingResults;

	return {
		loading,
		results: publication ? results : [],
	};
};

export default useIntersectingEvents;
