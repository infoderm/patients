import startOfYear from 'date-fns/startOfYear';
import startOfToday from 'date-fns/startOfToday';
import addYears from 'date-fns/addYears';
import addDays from 'date-fns/addDays';
import getDay from 'date-fns/getDay';

import {list} from '@iterable-iterator/list';
import {range} from '@iterable-iterator/range';

export const ALL_WEEK_DAYS = Object.freeze(list(range(7)));

// +/- 8_640_000_000_000_000 are the max Date bounds
// but we want to be able to exactly compute duration between any two dates and
// MAX_SAFE_INTEGER is only 9007199254740991
export const beginningOfTime = () => new Date(-4_320_000_000_000_000);
export const endOfTime = () => new Date(4_320_000_000_000_000);

const MILLISECONDS_MODULO = 1;
const SECONDS_MODULO = 1000 * MILLISECONDS_MODULO;
const MINUTE_MODULO = 60 * SECONDS_MODULO;
const HOUR_MODULO = 60 * MINUTE_MODULO;
const DAY_MODULO = 24 * HOUR_MODULO;
export const WEEK_MODULO = 7 * DAY_MODULO;

export const getDayOfWeekModulo = (weekModulo: number) =>
	Math.floor(weekModulo / DAY_MODULO);

/**
 * thisYearsInterval.
 *
 * @return {[Date, Date]} The interval [begin, end) corresponding to the
 * current year.
 */
export const thisYearsInterval = (): [Date, Date] => {
	const today = startOfToday();
	const beginningOfThisYear = startOfYear(today);
	const beginningOfNextYear = addYears(beginningOfThisYear, 1);
	return [beginningOfThisYear, beginningOfNextYear];
};

/**
 * Generate days in range.
 */
export const generateDays = function* (
	begin: Date,
	end: Date,
	displayedWeekDays: Set<number> = new Set(ALL_WEEK_DAYS),
): IterableIterator<Date> {
	let current = begin;
	while (current < end) {
		if (displayedWeekDays.has(getDay(current))) yield current;
		current = addDays(current, 1);
	}
};

export const someDateAtGivenDayOfWeek = (i: number): Date => {
	// 0 is Sunday
	const day = 4 + i;
	return new Date(1970, 0, day);
};

export const someDateAtGivenPositionOfYear = (i: number): Date => {
	return new Date(1970, 0, i - 1);
};
