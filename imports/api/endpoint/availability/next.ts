import assert from 'assert';

import {check} from 'meteor/check';
import define from '../define';

import properlyIntersectsWithRightOpenInterval from '../../interval/containsDate';
import isContainedInRightOpenIterval from '../../interval/beginsAfterDate';
import overlapsInterval from '../../interval/overlapsInterval';
import {Availability} from '../../collection/availability';
import {
	Constraint,
	Duration,
	initialSlot,
	overlapsAfterDate,
} from '../../availability';
import {WEEK_MODULO} from '../../../util/datetime';
import Wrapper from '../../transaction/Wrapper';

export default define({
	name: 'availability.next',
	validate(after: Date, duration: Duration, constraints: Constraint[]) {
		check(after, Date);
		check(duration, Number);
		check(constraints, Array);
	},
	async transaction(
		db: Wrapper,
		after: Date,
		duration: Duration,
		constraints: Constraint[],
	) {
		const owner = this.userId;

		const properlyIntersecting = await db.fetch(
			Availability,
			{
				$and: [{owner}, properlyIntersectsWithRightOpenInterval(after)],
			},
			{
				limit: 2,
			},
		);

		assert(properlyIntersecting.length <= 1);

		if (properlyIntersecting.length === 0) {
			// availability is empty
			return initialSlot(owner);
		}

		const firstContainedAndOverlapping = await db.findOne(
			Availability,
			{
				$and: [
					{owner, weight: 0},
					isContainedInRightOpenIterval(after),
					{
						$or: [
							...constraints.map(([weekShiftedBegin, weekShiftedEnd]) =>
								overlapsInterval(
									weekShiftedBegin,
									weekShiftedEnd,
									duration,
									'weekShiftedBegin',
									'weekShiftedEnd',
									'measure',
								),
							),
							// NOTE This is necessary because the first hit could be
							// in the second week of the slot
							...constraints.map(([weekShiftedBegin, weekShiftedEnd]) =>
								overlapsInterval(
									weekShiftedBegin + WEEK_MODULO,
									weekShiftedEnd + WEEK_MODULO,
									duration,
									'weekShiftedBegin',
									'weekShiftedEnd',
									'measure',
								),
							),
							// NOTE We do not need to go further, if there is
							// no hit in the second week there cannot be any
							// hit.
						],
					},
				],
			},
			{
				sort: {
					begin: 1,
				},
			},
		);

		return properlyIntersecting[0].weight === 0 &&
			overlapsAfterDate(after, duration, constraints, properlyIntersecting[0])
			? properlyIntersecting[0]
			: firstContainedAndOverlapping;
	},
});
