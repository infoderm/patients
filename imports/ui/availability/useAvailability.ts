import {type DependencyList} from 'react';

import {type Mongo} from 'meteor/mongo';

import isValid from 'date-fns/isValid';

import {
	Availability,
	type SlotDocument,
} from '../../api/collection/availability';
import intersectsInterval from '../../api/interval/intersectsInterval';
import useSubscription from '../../api/publication/useSubscription';
import useCursor from '../../api/publication/useCursor';
import intersects from '../../api/publication/availability/intersects';

const useAvailability = (
	begin: Date,
	end: Date,
	filter: Mongo.Selector<SlotDocument>,
	options: Mongo.Options<SlotDocument>,
	deps: DependencyList,
) => {
	// TODO Do not oversubscribe
	const publication = isValid(begin) && isValid(end) ? intersects : null;
	const isLoading = useSubscription(publication, begin, end, filter);

	const query = {
		...intersectsInterval(begin, end),
		...filter,
	};

	const results = useCursor(() => Availability.find(query, options), deps);

	return {
		loading: isLoading(),
		results: publication ? results : [],
	};
};

export default useAvailability;
