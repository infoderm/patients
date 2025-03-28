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
import type Filter from '../../api/query/Filter';
import type Options from '../../api/query/Options';
import type Selector from '../../api/query/Selector';

const useAvailability = (
	begin: Date,
	end: Date,
	filter: Filter<SlotDocument>,
	options: Options<SlotDocument>,
	deps: DependencyList,
) => {
	// TODO Do not oversubscribe
	const enabled = isValid(begin) && isValid(end);
	const isLoading = useSubscription(intersects, [begin, end, filter], enabled);

	const selector = {
		...intersectsInterval(begin, end),
		...filter,
	} as Selector<SlotDocument>;

	const {loading, results} = useCursor(
		() => Availability.find(selector, options),
		deps,
	);

	return {
		loading: isLoading() || loading,
		results: enabled ? results : [],
	};
};

export default useAvailability;
