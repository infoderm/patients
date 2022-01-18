import assert from 'assert';

import {window} from '@iterable-iterator/window';

import isSameDatetime from 'date-fns/isEqual';

import getDay from 'date-fns/getDay';
import getHours from 'date-fns/getHours';
import getMinutes from 'date-fns/getMinutes';
import getSeconds from 'date-fns/getSeconds';
import getMilliseconds from 'date-fns/getMilliseconds';
import differenceInCalendarWeeks from 'date-fns/differenceInCalendarWeeks';
import {beginningOfTime, endOfTime, WEEK_MODULO} from '../util/datetime';
import add from '../lib/interval/add';
import isEmpty from '../lib/interval/isEmpty';
import isContiguous from '../lib/interval/isContiguous';
import {units} from './duration';

import intersectsOrTouchesInterval from './interval/intersectsOrTouchesInterval';

import {
	Availability,
	SlotDocument,
	SlotFields,
} from './collection/availability';

export type Constraint = [number, number];
export type Duration = number;

const intervalsOverlap = (
	x0: number,
	x1: number,
	y0: number,
	y1: number,
	measure: number,
) =>
	(x1 - x0 >= measure && y0 <= x0 && x0 + measure <= y1) ||
	(x1 - x0 >= measure && y0 <= x1 - measure && x1 <= y1) ||
	(x0 <= y0 && y1 <= x1 && y1 - y0 >= measure);
// TODO replace with Math.min(x1, y1) - Math.max(x0, y0) >= measure; or similar
export const overlapsAfterDate = (
	after: Date,
	duration: Duration,
	constraints: Constraint[],
	interval: SlotFields,
) => {
	if (interval === undefined) return false;
	// TODO rewrite by applying various truncation to constraints instead of slot
	// so that these can be used directly in a DB query
	// NOTE probably not possible since truncation depends on slot

	assert(interval.begin < interval.end);

	if (after >= interval.end) return false;

	if (after > interval.begin) {
		interval = slot(after, interval.end, interval.weight);
	}

	for (const [weekShiftedBegin, weekShiftedEnd] of constraints) {
		if (
			intervalsOverlap(
				interval.weekShiftedBegin,
				interval.weekShiftedEnd,
				weekShiftedBegin,
				weekShiftedEnd,
				duration,
			)
		)
			return true;
		if (
			intervalsOverlap(
				interval.weekShiftedBegin,
				interval.weekShiftedEnd,
				weekShiftedBegin + WEEK_MODULO,
				weekShiftedEnd + WEEK_MODULO,
				duration,
			)
		)
			return true;
	}

	return false;
};

const getWeekMilliseconds = (datetime: Date) => {
	const day = getDay(datetime);
	const hours = getHours(datetime);
	const minutes = getMinutes(datetime);
	const seconds = getSeconds(datetime);
	const milliseconds = getMilliseconds(datetime);
	return (
		milliseconds + 1000 * (seconds + 60 * (minutes + 60 * (hours + 24 * day)))
	);
};

export const weekShifted = (begin: Date, end: Date) => {
	assert(!isEmpty(begin, end));
	const weekShiftedBegin = getWeekMilliseconds(begin);
	const diffInWeeks = differenceInCalendarWeeks(end, begin);
	const fill = diffInWeeks * units.week;
	const weekShiftedEnd = fill + getWeekMilliseconds(end);
	return [weekShiftedBegin, weekShiftedEnd];
};

const slot = (begin: Date, end: Date, weight: number): SlotFields => {
	const [weekShiftedBegin, weekShiftedEnd] = weekShifted(begin, end);
	const measure = Number(end) - Number(begin);
	return {
		begin,
		end,
		weekShiftedBegin,
		weekShiftedEnd,
		measure,
		weight,
	};
};

export const initialSlot = (owner: string) => ({
	...slot(beginningOfTime(), endOfTime(), 0),
	_id: '?',
	owner,
});

const simplify = (
	slots: Array<[Date, Date, number]>,
): Array<[Date, Date, number]> => {
	assert(slots.length >= 2);
	// merge with preceding and succeeding slots if weights became equal
	const [beginFirst, endFirst, weightFirst] = slots[0];
	const [beginSecond, endSecond, weightSecond] = slots[1];
	const [beginNextToLast, endNextToLast, weightNextToLast] =
		slots[slots.length - 2];
	const [beginLast, endLast, weightLast] = slots[slots.length - 1];
	assert(isSameDatetime(endFirst, beginSecond));
	assert(isSameDatetime(endNextToLast, beginLast));
	if (weightFirst === weightSecond) {
		if (weightNextToLast === weightLast) {
			switch (slots.length) {
				case 2:
					return [[beginFirst, endSecond, weightFirst]];
				case 3:
					return [[beginFirst, endLast, weightFirst]];
				default:
					return [
						[beginFirst, endSecond, weightFirst],
						...slots.slice(2, -2),
						[beginNextToLast, endLast, weightLast],
					];
			}
		}

		return [
			[beginFirst, endSecond, weightFirst],
			...slots.slice(2, slots.length),
		];
	}

	if (weightNextToLast === weightLast) {
		return [...slots.slice(0, -2), [beginNextToLast, endLast, weightLast]];
	}

	return slots;
};

const canBeSimplified = (slots: Array<[Date, Date, number]>): boolean => {
	for (const [left, right] of window(2, slots)) {
		const [, end, leftWeight] = left;
		const [begin, rightWeight] = right;
		if (isSameDatetime(end, begin) && leftWeight === rightWeight) return true;
	}

	return false;
};

export const insertHook = (
	owner: string,
	begin: Date,
	end: Date,
	weight: number,
) => {
	if (weight === 0 || isEmpty(begin, end)) return;

	// TODO use transaction

	const _intersected = Availability.find(
		{
			$and: [{owner}, intersectsOrTouchesInterval(begin, end)],
		},
		{
			sort: {
				begin: 1,
			},
		},
	).fetch();

	assert(
		isContiguous(
			isSameDatetime,
			_intersected.map((x) => [x.begin, x.end]),
		),
	);

	// Initialize timeline with monolith event
	const intersected: SlotDocument[] =
		_intersected.length === 0 ? [initialSlot(owner)] : _intersected;

	assert(
		isContiguous(
			isSameDatetime,
			intersected.map((x) => [x.begin, x.end]),
		),
	);

	const toDelete = _intersected.map((x) => x._id);
	const _toInsert = [];

	for (const slot of intersected) {
		for (const newSlot of add(
			slot.begin,
			slot.end,
			slot.weight,
			begin,
			end,
			weight,
		)) {
			_toInsert.push(newSlot);
		}
	}

	// console.debug('insertHook', {
	// owner,
	// begin,
	// end,
	// weight
	// }, {
	// _intersected,
	// intersected,
	// toDelete,
	// _toInsert
	// });

	assert(_toInsert.length >= 3);

	assert(isContiguous(isSameDatetime, _toInsert));

	const toInsert = simplify(_toInsert);

	assert(
		isContiguous(isSameDatetime, toInsert as unknown as Array<[Date, Date]>),
	);

	assert(isSameDatetime(toInsert[0][0], _toInsert[0][0]));
	assert(
		isSameDatetime(
			toInsert[toInsert.length - 1][1],
			_toInsert[_toInsert.length - 1][1],
		),
	);

	assert(!canBeSimplified(toInsert));

	Availability.remove({_id: {$in: toDelete}});

	for (const [a, b, w] of toInsert) {
		// TODO use bulk insertion (and transaction! redundant?)
		Availability.insert({
			...slot(a, b, w),
			owner,
		});
	}
};

export const removeHook = (
	owner: string,
	begin: Date,
	end: Date,
	weight: number,
) => {
	insertHook(owner, begin, end, -weight);
};

export const updateHook = (
	owner: string,
	oldBegin: Date,
	oldEnd: Date,
	oldWeight: number,
	newBegin: Date,
	newEnd: Date,
	newWeight: number,
) => {
	if (
		!isSameDatetime(newBegin, oldBegin) ||
		!isSameDatetime(newEnd, oldEnd) ||
		newWeight !== oldWeight
	) {
		// TODO optimize
		insertHook(owner, newBegin, newEnd, newWeight);
		removeHook(owner, oldBegin, oldEnd, oldWeight);
	}
};

export const availability = {
	insertHook,
	removeHook,
	updateHook,
};
