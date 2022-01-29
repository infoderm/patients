import startOfDay from 'date-fns/startOfDay';
import startOfWeek from 'date-fns/startOfWeek';
import endOfWeek from 'date-fns/endOfWeek';
import endOfMonth from 'date-fns/endOfMonth';
import addDays from 'date-fns/addDays';
import {Locale} from 'date-fns';
import {FirstWeekContainsDate, WeekStartsOn} from '../../i18n/datetime';

interface WeekOptions {
	locale?: Locale;
	weekStartsOn?: WeekStartsOn;
	firstWeekContainsDate?: FirstWeekContainsDate;
}

export function monthly(year: number, month: number, weekOptions: WeekOptions) {
	const firstDayOfMonth = new Date(year, month - 1, 1);
	const lastDayOfMonth = startOfDay(endOfMonth(firstDayOfMonth));
	const begin = startOfWeek(firstDayOfMonth, weekOptions); // Inclusive
	const end = addDays(startOfDay(endOfWeek(lastDayOfMonth, weekOptions)), 1); // Non-inclusive
	return [begin, end];
}

export function weekly(year: number, week: number, weekOptions: WeekOptions) {
	const someDayOfWeek = new Date(
		year,
		0,
		(weekOptions.firstWeekContainsDate ?? 1) + (week - 1) * 7,
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
