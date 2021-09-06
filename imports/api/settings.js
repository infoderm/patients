import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';

import {ALL_WEEK_DAYS} from '../ui/calendar/constants';

import {Settings} from './collection/settings';

if (Meteor.isServer) {
	Meteor.publish('settings', function () {
		return Settings.find({owner: this.userId});
	});
	Meteor.publish('setting', function (key) {
		check(key, String);
		return Settings.find({owner: this.userId, key});
	});
}

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
