import isAfter from 'date-fns/isAfter';
import {Availability, type SlotDocument} from '../../collection/availability';
import intersectsInterval from '../../interval/intersectsInterval';
import define from '../define';
import type Filter from '../../transaction/Filter';
import type Selector from '../../Selector';
import {AuthenticationLoggedIn} from '../../Authentication';
import schema from '../../../lib/schema';
import PublicationError from '../PublicationError';

export default define({
	name: 'availability.intersects',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([
		schema.date(),
		schema.date(),
		schema.object({
			/* Filter<SlotDocument> */
		}),
	]),
	cursor(begin, end, filter: Filter<SlotDocument>) {
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
