import isAfter from 'date-fns/isAfter';
import {
	Availability,
	slotFields,
	type SlotDocument,
} from '../../collection/availability';
import intersectsInterval from '../../interval/intersectsInterval';
import define from '../define';
import type Selector from '../../query/Selector';
import {AuthenticationLoggedIn} from '../../Authentication';
import schema from '../../../lib/schema';
import PublicationError from '../PublicationError';
import {userFilter} from '../../query/UserFilter';

export default define({
	name: 'availability.intersects',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([schema.date(), schema.date(), userFilter(slotFields)]),
	cursor(begin, end, filter) {
		if (isAfter(begin, end)) throw new PublicationError('begin is after end');

		const query = {
			...intersectsInterval(begin, end),
			...filter,
			owner: this.userId,
		} as Selector<SlotDocument>;

		const options = {};

		// TODO Make it work when Availability is empty
		return Availability.find(query, options);
	},
});
