import {type DependencyList} from 'react';

import {type Mongo} from 'meteor/mongo';

import isValid from 'date-fns/isValid';

import {Events, type EventDocument} from '../../api/collection/events';
import {beginsInInterval} from '../../api/events';
import useSubscription from '../../api/publication/useSubscription';
import useCursor from '../../api/publication/useCursor';
import interval from '../../api/publication/events/interval';

const useEvents = (
	begin: Date,
	end: Date,
	filter: Mongo.Selector<EventDocument>,
	options: Mongo.Options<EventDocument>,
	deps: DependencyList,
) => {
	// TODO Do not oversubscribe
	const publication = isValid(begin) && isValid(end) ? interval : null;
	const isLoading = useSubscription(publication, begin, end);

	const query = {
		...beginsInInterval(begin, end),
		...filter,
	};

	const results = useCursor(() => Events.find(query, options), deps);

	return {
		loading: isLoading(),
		results: publication ? results : [],
	};
};

export default useEvents;
