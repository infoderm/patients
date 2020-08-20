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
	const firstDayOfMonth = new Date(year, week - 1, 1);
	const lastDayOfMonth = startOfDay(endOfMonth(firstDayOfMonth));
	const begin = startOfWeek(firstDayOfMonth, weekOptions); // Inclusive
	const end = addDays(startOfDay(endOfWeek(lastDayOfMonth, weekOptions)), 1); // Non-inclusive
	return [begin, end];
}

export default {
	monthly,
	weekly
};
