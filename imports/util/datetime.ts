import startOfYear from 'date-fns/startOfYear';
import startOfToday from 'date-fns/startOfToday';
import addYears from 'date-fns/addYears';
import addDays from 'date-fns/addDays';
import getDay from 'date-fns/getDay';

import {list} from '@iterable-iterator/list';
import {range} from '@iterable-iterator/range';

export const ALL_WEEK_DAYS = Object.freeze(list(range(7)));

export const beginningOfTime = () => new Date(-8_640_000_000_000_000);
export const endOfTime = () => new Date(8_640_000_000_000_000);

const SECONDS_MODULO = 1;
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
