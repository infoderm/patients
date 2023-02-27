import {type DependencyList} from 'react';

import isValid from 'date-fns/isValid';

import {
	Availability,
	type SlotDocument,
} from '../../api/collection/availability';
import intersectsInterval from '../../api/interval/intersectsInterval';
import useSubscription from '../../api/publication/useSubscription';
import useCursor from '../../api/publication/useCursor';
import intersects from '../../api/publication/availability/intersects';
import type Filter from '../../api/transaction/Filter';
import type Options from '../../api/Options';
import type Selector from '../../api/Selector';

const useAvailability = (
	begin: Date,
	end: Date,
	filter: Filter<SlotDocument>,
	options: Options<SlotDocument>,
	deps: DependencyList,
) => {
	// TODO Do not oversubscribe
	const publication = isValid(begin) && isValid(end) ? intersects : null;
	const isLoading = useSubscription(publication, begin, end, filter);

	const selector = {
		...intersectsInterval(begin, end),
		...filter,
	} as Selector<SlotDocument>;

	const results = useCursor(() => Availability.find(selector, options), deps);

	return {
		loading: isLoading(),
		results: publication ? results : [],
	};
};

export default useAvailability;
