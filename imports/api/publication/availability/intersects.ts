import {Mongo} from 'meteor/mongo';
import isAfter from 'date-fns/isAfter';
import {check} from 'meteor/check';
import {Availability, SlotDocument} from '../../collection/availability';
import intersectsInterval from '../../interval/intersectsInterval';
import define from '../define';

export default define({
	name: 'availability.intersects',
	cursor(begin: Date, end: Date, filter: Mongo.Selector<SlotDocument>) {
		check(begin, Date);
		check(end, Date);

		if (isAfter(begin, end)) throw new Error('begin is after end');

		const query = {
			...intersectsInterval(begin, end),
			...filter,
			owner: this.userId,
		};

		const options = {};

		return Availability.find(query, options);
	},
});
