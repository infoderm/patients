import startOfDay from 'date-fns/start_of_day';
import startOfWeek from 'date-fns/start_of_week';
import endOfWeek from 'date-fns/end_of_week';
import endOfMonth from 'date-fns/end_of_month';
import addDays from 'date-fns/add_days';

export function monthly ( year , month , weekOptions ) {
	const firstDayOfMonth = new Date(year, month - 1, 1);
	const lastDayOfMonth = startOfDay(endOfMonth(firstDayOfMonth));
	const begin = startOfWeek(firstDayOfMonth, weekOptions); // inclusive
	const end = addDays(startOfDay(endOfWeek(lastDayOfMonth, weekOptions)), 1); // non-inclusive
	return [begin, end];
}

export function weekly ( year , week , weekOptions ) {
	const firstDayOfMonth = new Date(year, week - 1, 1);
	const lastDayOfMonth = startOfDay(endOfMonth(firstDayOfMonth));
	const begin = startOfWeek(firstDayOfMonth, weekOptions); // inclusive
	const end = addDays(startOfDay(endOfWeek(lastDayOfMonth, weekOptions)), 1); // non-inclusive
	return [begin, end];
}

export default {
	monthly ,
	weekly ,
} ;
