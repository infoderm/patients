import {type PaletteMode} from '@mui/material';
import {indigo, pink} from '@mui/material/colors';

import {type AvailableLocale} from '../i18n/availableLocales';
import {type FirstWeekContainsDate} from '../i18n/datetime';

import {ALL_WEEK_DAYS, type WeekDay} from '../util/datetime';
import type ModuloWeekInterval from '../ui/settings/ModuloWeekInterval';

import {Settings} from './collection/settings';

import {type PaymentMethod} from './collection/consultations';

export type UserSettings = {
	'theme-palette-mode': PaletteMode;
	'theme-palette-primary': string;
	'theme-palette-secondary': string;
	'theme-palette-contrast-threshold': number;
	'navigation-drawer-is-open': 'open' | 'closed';
	'books-sorting-order': -1 | 1;
	currency: 'EUR';
	lang: 'navigator' | AvailableLocale;
	'appointment-duration': number[];
	'appointment-cancellation-reason': string[];
	'work-schedule': ModuloWeekInterval[];
	'agenda-slot-click-sets-initial-time': 'off' | 'begin';
	'important-strings': string[];
	'week-starts-on': 'locale' | WeekDay;
	'first-week-contains-date': 'locale' | FirstWeekContainsDate;
	'text-transform': 'none' | 'uppercase';
	iban: string;
	'account-holder': string;
	'displayed-week-days': WeekDay[];
	'consultations-paid-sync': PaymentMethod[];
	'user-account-display-name': string;
};

export type SettingKey = keyof UserSettings;

export const defaults: UserSettings = {
	'theme-palette-mode': 'light',
	'theme-palette-primary': indigo[500],
	'theme-palette-secondary': pink.A400,
	'theme-palette-contrast-threshold': 3,
	'navigation-drawer-is-open': 'closed',
	'books-sorting-order': -1,
	currency: 'EUR',
	lang: 'navigator',
	'appointment-duration': [15 * 60 * 1000, 30 * 60 * 1000],
	'appointment-cancellation-reason': ['patient-cancelled', 'doctor-cancelled'],
	'work-schedule': [],
	'agenda-slot-click-sets-initial-time': 'begin',
	'important-strings': [],
	'week-starts-on': 'locale',
	'first-week-contains-date': 'locale',
	'text-transform': 'uppercase',
	iban: '',
	'account-holder': '',
	'displayed-week-days': [...ALL_WEEK_DAYS],
	'consultations-paid-sync': [],
	'user-account-display-name': '',
};

export async function get(owner: string, key: string) {
	const item = await Settings.findOneAsync({owner, key});
	if (item === undefined) {
		return defaults[key];
	}

	return item.value;
}
