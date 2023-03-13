import {useState, useMemo, useEffect} from 'react';

import dateFormat from 'date-fns/format';
import dateFormatDistance from 'date-fns/formatDistance';
import dateFormatDistanceStrict from 'date-fns/formatDistanceStrict';
import dateFormatRelative from 'date-fns/formatRelative';
import dateFormatDuration from 'date-fns/formatDuration';

import intervalToDuration from 'date-fns/intervalToDuration';

import startOfToday from 'date-fns/startOfToday';

import {get as getSetting} from '../api/settings';

import {useSettingCached} from '../ui/settings/hooks';
import {
	ALL_WEEK_DAYS,
	someDateAtGivenDayOfWeek,
	someDateAtGivenPositionOfYear,
	type WeekDay,
} from '../lib/datetime';
import useLocaleKey from './useLocale';

const localeLoaders: Readonly<Record<string, () => Promise<Locale>>> = {
	'nl-BE': async () =>
		import('date-fns/locale/nl-BE/index.js') as Promise<Locale>,
	'fr-BE': async () => import('date-fns/locale/fr/index.js') as Promise<Locale>,
};

const loadLocale = async (key: string): Promise<Locale | undefined> =>
	localeLoaders[key]?.();

export const dateMaskMap = {
	'en-US': '__/__/____',
	'nl-BE': '__.__.____',
	'fr-BE': '__/__/____',
};

export const dateTimeMaskMap = {
	'en-US': `${dateMaskMap['en-US']} __:__ _M`,
	'nl-BE': `${dateMaskMap['nl-BE']} __:__`,
	'fr-BE': `${dateMaskMap['fr-BE']} __:__`,
};

const localesCache = new Map<string, Locale | undefined>();

const getLocale = async (owner: string): Promise<Locale | undefined> => {
	const key = getSetting(owner, 'lang');
	if (localesCache.has(key)) {
		return localesCache.get(key);
	}

	return loadLocale(key).then(
		(loadedLocale) => {
			localesCache.set(key, loadedLocale);
			return loadedLocale;
		},
		(error) => {
			const message = error instanceof Error ? error.message : 'unknown error';
			console.error(`failed to load locale ${key}: ${message}`);
			console.debug({error});
			return undefined;
		},
	);
};

export const useLocale = () => {
	const key = useLocaleKey();
	const [lastLoadedLocale, setLastLoadedLocale] = useState<Locale | undefined>(
		undefined,
	);

	useEffect(() => {
		if (localesCache.has(key)) {
			setLastLoadedLocale(localesCache.get(key));
			return undefined;
		}

		let isCancelled = false;
		loadLocale(key).then(
			(loadedLocale) => {
				localesCache.set(key, loadedLocale);
				if (!isCancelled) {
					setLastLoadedLocale(loadedLocale);
				}
			},
			(error) => {
				const message =
					error instanceof Error ? error.message : 'unknown error';
				console.error(`failed to load locale ${key}: ${message}`);
				console.debug({error});
			},
		);
		return () => {
			isCancelled = true;
		};
	}, [key, setLastLoadedLocale]);

	return localesCache.has(key) ? localesCache.get(key) : lastLoadedLocale;
};

export type WeekStartsOn = WeekDay;
export type FirstWeekContainsDate = 1 | 2 | 3 | 4 | 5 | 6 | 7;

const localeToWeekStartsOn = (locale: Locale | undefined): WeekStartsOn =>
	locale?.options?.weekStartsOn ?? 0;

export const useLocaleWeekStartsOn = (): WeekStartsOn => {
	const locale = useLocale();
	return localeToWeekStartsOn(locale);
};

export const useWeekStartsOn = (): WeekStartsOn => {
	const localized = useLocaleWeekStartsOn();
	const {value: setting} = useSettingCached('week-starts-on');
	return setting === 'locale' ? localized : setting;
};

const localeToFirstWeekContainsDate = (
	locale: Locale | undefined,
): FirstWeekContainsDate => locale?.options?.firstWeekContainsDate ?? 1;

export const useLocaleFirstWeekContainsDate = (): FirstWeekContainsDate => {
	const locale = useLocale();
	return localeToFirstWeekContainsDate(locale);
};

export const useFirstWeekContainsDate = (): FirstWeekContainsDate => {
	const localized = useLocaleFirstWeekContainsDate();
	const {value: setting} = useSettingCached('first-week-contains-date');
	return setting === 'locale' ? localized : setting;
};

export const getWeekStartsOn = async (owner: string): Promise<WeekStartsOn> => {
	const weekStartsOn = getSetting(owner, 'week-starts-on');
	if (weekStartsOn !== 'locale') return weekStartsOn;
	const locale = await getLocale(owner);
	return localeToWeekStartsOn(locale);
};

export const getFirstWeekContainsDate = async (
	owner: string,
): Promise<FirstWeekContainsDate> => {
	const firstWeekContainsDate = getSetting(owner, 'first-week-contains-date');
	if (firstWeekContainsDate !== 'locale') return firstWeekContainsDate;
	const locale = await getLocale(owner);
	return localeToFirstWeekContainsDate(locale);
};

export const useDefaultDateFormatOptions = () => {
	const locale = useLocale();
	const weekStartsOn = useWeekStartsOn();
	const firstWeekContainsDate = useFirstWeekContainsDate();
	return useMemo(
		() => ({
			locale,
			weekStartsOn,
			firstWeekContainsDate,
		}),
		[locale, weekStartsOn, firstWeekContainsDate],
	);
};

export const useDateMask = () => {
	const key = useLocaleKey();
	return dateMaskMap[key];
};

export const useDateTimeMask = () => {
	const key = useLocaleKey();
	return dateTimeMaskMap[key];
};

const stringifyOptions = (options) => {
	if (options === undefined) return undefined;

	const {locale, ...rest} = options;
	return locale !== undefined
		? JSON.stringify({
				locale: locale.code,
				...rest,
		  })
		: JSON.stringify(rest);
};

export const useDateFormat = (hookFormat = 'PP', hookOptions?) => {
	const defaultOptions = useDefaultDateFormatOptions();
	return useMemo(
		() =>
			(date: number | Date, format = hookFormat, options?) =>
				dateFormat(date, format, {
					...defaultOptions,
					...hookOptions,
					...options,
				}),
		[defaultOptions, hookFormat, stringifyOptions(hookOptions)],
	);
};

const useLocalizedDateFormatDistanceOrRelative = (fn, hookOptions) => {
	const defaultOptions = useDefaultDateFormatOptions();
	return useMemo(
		() => (date, baseDate, options?) =>
			fn(date, baseDate, {
				...defaultOptions,
				...hookOptions,
				...options,
			}),
		[defaultOptions, fn, stringifyOptions(hookOptions)],
	);
};

export const useDateFormatDistance = (hookOptions?) =>
	useLocalizedDateFormatDistanceOrRelative(dateFormatDistance, hookOptions);
export const useDateFormatDistanceStrict = (hookOptions?) =>
	useLocalizedDateFormatDistanceOrRelative(
		dateFormatDistanceStrict,
		hookOptions,
	);
export const useDateFormatRelative = (hookOptions?) =>
	useLocalizedDateFormatDistanceOrRelative(dateFormatRelative, hookOptions);

export const useDateFormatDuration = (hookOptions?) => {
	const defaultOptions = useDefaultDateFormatOptions();
	return useMemo(
		() => (duration: Duration, options?) =>
			dateFormatDuration(duration, {
				...defaultOptions,
				...hookOptions,
				...options,
			}),
		[defaultOptions, stringifyOptions(hookOptions)],
	);
};

export const useDateFormatAge = (hookOptions?) => {
	const tuple = useDateFormatDuration({...hookOptions, delimiter: ','});
	return useMemo(
		() => (birthdate: Date, deathdate: Date | undefined, options?) => {
			const thisMorningOrDeathdate = deathdate ?? startOfToday();
			const ageInterval = {start: birthdate, end: thisMorningOrDeathdate};
			const duration = intervalToDuration(ageInterval);
			const detailedAge = tuple(duration, options);
			const shortAge: string = detailedAge.split(',')[0]!;
			const displayedAge =
				(ageInterval.end < ageInterval.start ? '-' : '') + shortAge;
			return displayedAge;
		},
		[tuple],
	);
};

export const useDaysPositions = (positions: number[]) => {
	const format = useDateFormat('Do');
	return useMemo(
		() => positions.map((i) => format(someDateAtGivenPositionOfYear(i))),
		[positions, format],
	);
};

export const useDaysNames = <D extends number>(days: readonly D[]) => {
	const format = useDateFormat('cccc');
	return useMemo(
		() => new Map(days.map((i) => [i, format(someDateAtGivenDayOfWeek(i))])),
		[days, format],
	);
};

export const useDaysOfWeek = () => useDaysNames(ALL_WEEK_DAYS);

export const useIntlDateTimeFormat = (options?) => {
	const key = useLocaleKey();
	return new Intl.DateTimeFormat(key, options);
};

export const useDateFormatRange = (format, options?) => {
	const formatPart = useDateFormat(format, options);
	return useMemo(
		() => (startDate, endDate) =>
			`${formatPart(startDate)} — ${formatPart(endDate)}`,
		[formatPart],
	);
};

export const useWeekYearFormat = () => {
	const dateFormat = useDateFormat();
	return useMemo(() => {
		const yearFormat = (date: Date) =>
			dateFormat(date, 'YYYY', {
				useAdditionalWeekYearTokens: true,
			});
		const weekFormat = (date: Date) => dateFormat(date, 'ww');
		return {
			yearFormat,
			weekFormat,
		};
	}, [dateFormat]);
};
