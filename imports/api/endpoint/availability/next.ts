import assert from 'assert';

import define from '../define';

import schema from '../../../util/schema';
import {WEEK_MODULO} from '../../../util/datetime';

import properlyIntersectsWithRightOpenInterval from '../../interval/containsDate';
import isContainedInRightOpenIterval from '../../interval/beginsAfterDate';
import overlapsInterval from '../../interval/overlapsInterval';
import {Availability, type SlotDocument} from '../../collection/availability';
import {
	initialSlot,
	overlapsAfterDate,
	duration,
	constraint,
} from '../../availability';
import type TransactionDriver from '../../transaction/TransactionDriver';
import {AuthenticationLoggedIn} from '../../Authentication';

export default define({
	name: 'availability.next',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([schema.date(), duration, schema.array(constraint)]),
	async transaction(db: TransactionDriver, after, duration, inputConstraints) {
		const constraints = inputConstraints.filter(
			([left, right]) => right - left >= duration,
		);
		if (constraints.length === 0) return null;

		const owner = this.userId;

		const properlyIntersecting: SlotDocument[] = await db.fetch(
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

		const slot = properlyIntersecting[0]!;

		if (
			slot.weight === 0 &&
			overlapsAfterDate(after, duration, constraints, slot)
		) {
			return slot;
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

		return firstContainedAndOverlapping;
	},
	simulate(_after, _duration, _constraints) {
		return undefined;
	},
});
