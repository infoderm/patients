import assert from 'assert';

import {window} from '@iterable-iterator/window';

import isSameDatetime from 'date-fns/isEqual';

import {units} from './duration';

import intersectsOrTouchesInterval from './interval/intersectsOrTouchesInterval';

import add from './interval/add';
import {
	Availability,
	SlotDocument,
	SlotFields,
} from './collection/availability';

export type Constraint = [number, number];
export type Duration = number;

const SECONDS_MODULO = 1;
const MINUTE_MODULO = 60 * SECONDS_MODULO;
const HOUR_MODULO = 60 * MINUTE_MODULO;
const DAY_MODULO = 24 * HOUR_MODULO;
export const WEEK_MODULO = 7 * DAY_MODULO;

const intervalsOverlap = (
	x0: number,
	x1: number,
	y0: number,
	y1: number,
	measure: number,
) =>
	(x1 - x0 >= measure && x0 >= y0 && x0 + measure < y1) ||
	(x1 - x0 >= measure && x1 - measure > y0 && x1 <= y1) ||
	(x0 < y0 && x1 > y1 && y1 - y0 >= measure);
// Math.min(x1, y1) - Math.max(x0, y0) >= measure;
export const overlapsAfterDate = (
	after: Date,
	duration: Duration,
	constraints: Constraint[],
	slot: SlotDocument,
) => {
	if (slot === undefined) return false;
	// TODO rewrite by applying various truncation to constraints instead of slot
	// so that these can be used directly in a DB query

	assert(slot.begin < slot.end);

	const toTruncateLeft = Number(after) - Number(slot.begin);
	const toInspectRight = Number(slot.end) - Number(after);

	if (toTruncateLeft <= 0) {
		// slot is completely contained in right open interval
		for (const [beginModuloWeek, endModuloWeek] of constraints) {
			if (
				intervalsOverlap(
					slot.beginModuloWeek,
					slot.endModuloWeek,
					beginModuloWeek,
					endModuloWeek,
					duration,
				)
			)
				return true;
			if (
				intervalsOverlap(
					slot.beginModuloWeek,
					slot.endModuloWeek,
					beginModuloWeek + WEEK_MODULO,
					endModuloWeek + WEEK_MODULO,
					duration,
				)
			)
				return true;
			if (
				intervalsOverlap(
					slot.beginModuloWeek,
					slot.endModuloWeek,
					beginModuloWeek + WEEK_MODULO * 2,
					endModuloWeek + WEEK_MODULO * 2,
					duration,
				)
			)
				return true;
		}
	} else if (toTruncateLeft <= WEEK_MODULO - slot.beginModuloWeek) {
		// after occurs during the first week of slot
		for (const [beginModuloWeek, endModuloWeek] of constraints) {
			if (
				intervalsOverlap(
					slot.beginModuloWeek + toTruncateLeft,
					slot.endModuloWeek,
					beginModuloWeek,
					endModuloWeek,
					duration,
				)
			)
				return true;
			if (
				intervalsOverlap(
					slot.beginModuloWeek + toTruncateLeft,
					slot.endModuloWeek,
					beginModuloWeek + WEEK_MODULO,
					endModuloWeek + WEEK_MODULO,
					duration,
				)
			)
				return true;
			if (
				intervalsOverlap(
					slot.beginModuloWeek + toTruncateLeft,
					slot.endModuloWeek,
					beginModuloWeek + WEEK_MODULO * 2,
					endModuloWeek + WEEK_MODULO * 2,
					duration,
				)
			)
				return true;
		}
	} else if (toInspectRight <= slot.endModuloWeek % WEEK_MODULO) {
		// after occurs during the last week of slot
		const shift = Math.floor(slot.endModuloWeek / WEEK_MODULO) * WEEK_MODULO;
		assert(shift === WEEK_MODULO || shift === WEEK_MODULO * 2);
		for (const [beginModuloWeek, endModuloWeek] of constraints) {
			if (
				intervalsOverlap(
					slot.endModuloWeek - toInspectRight,
					slot.endModuloWeek,
					beginModuloWeek + shift,
					endModuloWeek + shift,
					duration,
				)
			)
				return true;
		}
	} else {
		// after occurs in some week in the middle of the slot
		for (const [beginModuloWeek, endModuloWeek] of constraints) {
			if (
				intervalsOverlap(
					slot.beginModuloWeek + toTruncateLeft,
					slot.endModuloWeek,
					beginModuloWeek + WEEK_MODULO,
					endModuloWeek + WEEK_MODULO,
					duration,
				)
			)
				return true;
			if (
				intervalsOverlap(
					slot.beginModuloWeek + toTruncateLeft,
					slot.endModuloWeek,
					beginModuloWeek + WEEK_MODULO * 2,
					endModuloWeek + WEEK_MODULO * 2,
					duration,
				)
			)
				return true;
		}
	}

	return false;
};

const mod = (n: number, m: number) => ((n % m) + m) % m;

const slot = (begin: Date, end: Date, weight: number): SlotFields => {
	const beginModuloWeek = mod(begin.getTime(), units.week);
	const endModuloWeek = mod(end.getTime(), units.week);
	const measureModuloWeek = endModuloWeek - beginModuloWeek;
	// TODO handle negative measureModuloWeek
	return {
		begin,
		end,
		beginModuloWeek,
		endModuloWeek,
		measureModuloWeek,
		weight,
	};
};

const BEGINNING_OF_TIME = new Date(-8_640_000_000_000_000);
const END_OF_TIME = new Date(8_640_000_000_000_000);

const simplify = (
	slots: Array<[Date, Date, number]>,
): Array<[Date, Date, number]> => {
	// merge with preceding and succeeding slots if weights became equal
	const [beginFirst, endFirst, weightFirst] = slots[0];
	const [beginSecond, endSecond, weightSecond] = slots[1];
	const [beginNextToLast, endNextToLast, weightNextToLast] =
		slots[slots.length - 2];
	const [beginLast, endLast, weightLast] = slots[slots.length - 1];
	assert(endFirst === beginSecond);
	assert(endNextToLast === beginLast);
	if (weightFirst === weightSecond) {
		if (weightNextToLast === weightLast) {
			return [
				[beginFirst, endSecond, weightFirst],
				...slots.slice(2, -2),
				[beginNextToLast, endLast, weightLast],
			];
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

const isContiguous = (slots: Array<[Date, Date, number]>): boolean => {
	for (const [left, right] of window(2, slots)) {
		const [, end] = left;
		const [begin] = right;
		if (!isSameDatetime(end, begin)) return false;
	}

	return true;
};

export const insertHook = (
	owner: string,
	begin: Date,
	end: Date,
	weight: number,
) => {
	if (weight === 0) return;

	// TODO use transaction

	const _intersected = Availability.find({
		$and: [{owner}, intersectsOrTouchesInterval(begin, end)],
	}).fetch();

	// Initialize timeline with monolith event
	const intersected =
		_intersected.length === 0
			? [
					{
						...slot(BEGINNING_OF_TIME, END_OF_TIME, 0),
						owner,
					},
			  ]
			: _intersected;

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

	assert(_toInsert.length >= 3);

	assert(isContiguous(_toInsert));

	const toInsert = simplify(_toInsert);

	assert(isContiguous(toInsert));

	assert(isSameDatetime(toInsert[0][0], _toInsert[0][0]));
	assert(
		isSameDatetime(
			toInsert[toInsert.length - 1][1],
			_toInsert[_toInsert.length - 1][1],
		),
	);

	Availability.remove({_id: {$in: toDelete}});

	for (const [a, b, w] of toInsert) {
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
	// TODO optimize
	insertHook(owner, newBegin, newEnd, newWeight);
	removeHook(owner, oldBegin, oldEnd, oldWeight);
};

export const availability = {
	insertHook,
};
