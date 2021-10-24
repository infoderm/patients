import assert from 'assert';

import {check} from 'meteor/check';
import define from '../define';

import properlyIntersectsWithRightOpenInterval from '../../interval/containsDate';
import isContainedInRightOpenIterval from '../../interval/beginsAfterDate';
import overlapsInterval from '../../interval/overlapsInterval';
import {Availability} from '../../collection/availability';
import {Constraint, Duration, overlapsAfterDate} from '../../availability';
import {WEEK_MODULO} from '../../../util/datetime';

export default define({
	name: 'availability.next',
	validate(after: Date, duration: Duration, constraints: Constraint[]) {
		check(after, Date);
		check(duration, Number);
		check(constraints, Array);
	},
	run(after: Date, duration: Duration, constraints: Constraint[]) {
		const properlyIntersecting = Availability.find(
			{
				$and: [
					{owner: this.userId, weight: 0},
					properlyIntersectsWithRightOpenInterval(after),
				],
			},
			{
				limit: 2,
			},
		).fetch();

		assert(properlyIntersecting.length <= 1);

		const firstContainedAndOverlapping = Availability.findOne(
			{
				$and: [
					{owner: this.userId, weight: 0},
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

		return overlapsAfterDate(
			after,
			duration,
			constraints,
			properlyIntersecting[0],
		)
			? properlyIntersecting[0]
			: firstContainedAndOverlapping;
	},
});
