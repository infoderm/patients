import {ALL_WEEK_DAYS} from '../util/datetime';
import {Settings} from './collection/settings';

const methods = {
	update: 'settings.update',
	reset: 'settings.reset',
};

const defaults = {
	'navigation-drawer-is-open': 'closed',
	'books-sorting-order': -1,
	currency: 'EUR',
	lang: 'en-US',
	'appointment-duration': [15 * 60 * 1000, 30 * 60 * 1000],
	'appointment-cancellation-reason': ['patient-cancelled', 'doctor-cancelled'],
	'work-schedule': [],
	'important-strings': [],
	'week-starts-on': 'locale',
	'first-week-contains-date': 'locale',
	'text-transform': 'uppercase',
	iban: '',
	'account-holder': '',
	'displayed-week-days': [...ALL_WEEK_DAYS],
};

export const settings = {
	defaults,
	methods,
};

export function get(owner: string, key: string) {
	const item = Settings.findOne({owner, key});
	if (item === undefined) {
		return defaults[key];
	}

	return item.value;
}
