import {ALL_WEEK_DAYS} from '../ui/calendar/constants';

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
	'week-starts-on': 1,
	'text-transform': 'uppercase',
	iban: '',
	'account-holder': '',
	'displayed-week-days': [...ALL_WEEK_DAYS],
};

const settings = {
	defaults,
	methods,
};

export {settings};
