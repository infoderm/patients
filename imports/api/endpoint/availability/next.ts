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
							...constraints.map(([beginModuloWeek, endModuloWeek]) =>
								overlapsInterval(
									beginModuloWeek,
									endModuloWeek,
									duration,
									'beginModuloWeek',
									'endModuloWeek',
									'measureModuloWeek',
								),
							),
							...constraints.map(([beginModuloWeek, endModuloWeek]) =>
								overlapsInterval(
									beginModuloWeek + WEEK_MODULO,
									endModuloWeek + WEEK_MODULO,
									duration,
									'beginModuloWeek',
									'endModuloWeek',
									'measureModuloWeek',
								),
							),
							...constraints.map(([beginModuloWeek, endModuloWeek]) =>
								overlapsInterval(
									beginModuloWeek + WEEK_MODULO * 2,
									endModuloWeek + WEEK_MODULO * 2,
									duration,
									'beginModuloWeek',
									'endModuloWeek',
									'measureModuloWeek',
								),
							),
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
			? properlyIntersecting
			: firstContainedAndOverlapping;
	},
});
