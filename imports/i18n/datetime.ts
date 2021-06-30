import {useMemo} from 'react';

import {list} from '@iterable-iterator/list';
import {range} from '@iterable-iterator/range';

import dateFormat from 'date-fns/format';
import dateFormatDistance from 'date-fns/formatDistance';
import dateFormatDistanceStrict from 'date-fns/formatDistanceStrict';
import dateFormatRelative from 'date-fns/formatRelative';
import dateFormatDuration from 'date-fns/formatDuration';

import intervalToDuration from 'date-fns/intervalToDuration';

import startOfToday from 'date-fns/startOfToday';

import {enUS, nlBE, fr} from 'date-fns/locale';

import {useSettingCached} from '../client/settings';

export const locales: Readonly<Record<string, Locale>> = {
	'en-US': enUS,
	'nl-BE': nlBE,
	'fr-BE': fr
};

export const localeDescriptions: Readonly<Record<string, string>> = {
	'en-US': 'English (US)',
	'fr-BE': 'Français (Belgique)',
	'nl-BE': 'Nederlands (Belgïe)'
};

const useLocaleKey = () => useSettingCached('lang').value;

const useLocale = () => {
	const key = useLocaleKey();
	return locales[key];
};

export const useDateFormat = (defaultFormat = 'PP', defaultOptions?) => {
	const locale = useLocale();
	return useMemo(
		() =>
			(date: number | Date, format = defaultFormat, options?) =>
				dateFormat(date, format, {
					locale,
					...defaultOptions,
					...options
				}),
		[locale]
	);
};

const useLocalizedDateFormatDistanceOrRelative = (fn, defaultOptions) => {
	const locale = useLocale();
	return useMemo(
		() => (date, baseDate, options) =>
			fn(date, baseDate, {
				locale,
				...defaultOptions,
				...options
			}),
		[locale]
	);
};

export const useDateFormatDistance = (defaultOptions?) =>
	useLocalizedDateFormatDistanceOrRelative(dateFormatDistance, defaultOptions);
export const useDateFormatDistanceStrict = (defaultOptions?) =>
	useLocalizedDateFormatDistanceOrRelative(
		dateFormatDistanceStrict,
		defaultOptions
	);
export const useDateFormatRelative = (defaultOptions?) =>
	useLocalizedDateFormatDistanceOrRelative(dateFormatRelative, defaultOptions);

export const useDateFormatDuration = (defaultOptions?) => {
	const locale = useLocale();
	return useMemo(
		() => (duration: Duration, options?) =>
			dateFormatDuration(duration, {
				locale,
				...defaultOptions,
				...options
			}),
		[locale]
	);
};

export const useDateFormatAge = (defaultOptions?) => {
	const tuple = useDateFormatDuration({...defaultOptions, delimiter: ','});
	return useMemo(
		() => (birthdate: Date, options?) => {
			const thisMorning = startOfToday();
			const ageInterval = {start: birthdate, end: thisMorning};
			const duration = intervalToDuration(ageInterval);
			const detailedAge = tuple(duration, options);
			const shortAge = detailedAge.split(',')[0];
			const displayedAge =
				(ageInterval.end < ageInterval.start ? '-' : '') + shortAge;
			return displayedAge;
		},
		[tuple]
	);
};

const someDateAtGivenDayOfWeek = (i: number) => {
	// 0 is Sunday
	const day = 4 + i;
	return new Date(1970, 0, day);
};

export const useDaysNames = (days: number[]) => {
	const format = useDateFormat('cccc');
	return days.map((i) => format(someDateAtGivenDayOfWeek(i)));
};

export const useDaysOfWeek = () => useDaysNames(list(range(7)));

export const useIntlDateTimeFormat = (options?) => {
	const locale = useLocaleKey();
	return new Intl.DateTimeFormat(locale, options);
};

export const useDateFormatRange = (format, options) => {
	const formatPart = useDateFormat(format, options);
	return useMemo(() => {
		return (startDate, endDate) =>
			`${formatPart(startDate)} — ${formatPart(endDate)}`;
	}, [formatPart]);
};
