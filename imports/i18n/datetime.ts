import {useMemo} from 'react';

import {list} from '@iterable-iterator/list';
import {range} from '@iterable-iterator/range';

import dateFormat from 'date-fns/format';
import dateFormatDistance from 'date-fns/formatDistance';
import dateFormatDistanceStrict from 'date-fns/formatDistanceStrict';
import dateFormatRelative from 'date-fns/formatRelative';

import {enUS, nlBE, fr} from 'date-fns/locale';

import {useSettingCached} from '../client/settings';

const locales = {
	'en-US': enUS,
	'nl-BE': nlBE,
	'fr-BE': fr
};

const useLocale = () => {
	const {value: key} = useSettingCached('lang');
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
