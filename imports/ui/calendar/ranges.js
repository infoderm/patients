import startOfDay from 'date-fns/startOfDay';
import startOfWeek from 'date-fns/startOfWeek';
import endOfWeek from 'date-fns/endOfWeek';
import endOfMonth from 'date-fns/endOfMonth';
import addDays from 'date-fns/addDays';

export function monthly(year, month, weekOptions) {
	const firstDayOfMonth = new Date(year, month - 1, 1);
	const lastDayOfMonth = startOfDay(endOfMonth(firstDayOfMonth));
	const begin = startOfWeek(firstDayOfMonth, weekOptions); // Inclusive
	const end = addDays(startOfDay(endOfWeek(lastDayOfMonth, weekOptions)), 1); // Non-inclusive
	return [begin, end];
}

export function weekly(year, week, weekOptions) {
	const someDayOfWeek = new Date(
		year,
		0,
		(weekOptions.firstWeekContainsDate || 1) + (week - 1) * 7,
	);
	const lastDayOfWeek = startOfDay(endOfWeek(someDayOfWeek, weekOptions));
	const begin = startOfWeek(someDayOfWeek, weekOptions); // Inclusive
	const end = addDays(lastDayOfWeek, 1); // Non-inclusive
	return [begin, end];
}

export default {
	monthly,
	weekly,
};
