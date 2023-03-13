import isAfter from 'date-fns/isAfter';
import {check} from 'meteor/check';
import {Availability, type SlotDocument} from '../../collection/availability';
import intersectsInterval from '../../interval/intersectsInterval';
import define from '../define';
import type Filter from '../../transaction/Filter';
import type Selector from '../../Selector';
import {AuthenticationLoggedIn} from '../../Authentication';

export default define({
	name: 'availability.intersects',
	authentication: AuthenticationLoggedIn,
	cursor(begin: Date, end: Date, filter: Filter<SlotDocument>) {
		check(begin, Date);
		check(end, Date);

		if (isAfter(begin, end)) throw new Error('begin is after end');

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
