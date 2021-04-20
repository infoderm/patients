import startOfYear from 'date-fns/startOfYear';
import startOfToday from 'date-fns/startOfToday';
import addYears from 'date-fns/addYears';

/**
 * thisYearsInterval.
 *
 * @return {[Date, Date]} The interval [begin, end) corresponding to the
 * current year.
 */
export const thisYearsInterval = () => {
	const today = startOfToday();
	const beginningOfThisYear = startOfYear(today);
	const beginningOfNextYear = addYears(beginningOfThisYear, 1);
	return [beginningOfThisYear, beginningOfNextYear];
};
