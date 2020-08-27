import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';

const Settings = new Mongo.Collection('settings');

if (Meteor.isServer) {
	Meteor.publish('settings', function () {
		return Settings.find({owner: this.userId});
	});
	Meteor.publish('setting', function (key) {
		check(key, String);
		return Settings.find({owner: this.userId, key});
	});
}

Meteor.methods({
	'settings.update'(key, value) {
		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		// const updatedAt = new Date();
		const owner = this.userId;
		// const username = Meteor.users.findOne(this.userId).username;

		Settings.upsert(
			{owner, key},
			{
				$set: {
					owner,
					key,
					value
				}
			}
		);
	},

	'settings.reset'(key) {
		check(key, String);
		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		return Settings.remove({owner: this.userId, key});
	}
});

const methods = {
	update: 'settings.update',
	reset: 'settings.reset'
};

const defaults = {
	'navigation-drawer-is-open': 'closed',
	currency: 'EUR',
	lang: 'en',
	'appointment-duration': [15 * 60 * 1000, 30 * 60 * 1000],
	'important-strings': [],
	'week-starts-on': 1,
	'text-transform': 'uppercase',
	iban: '',
	'account-holder': ''
};

const localStoragePrefix = 'u3208hfosjas-';

function get(key) {
	const item = Settings.findOne({key});
	if (item === undefined) {
		return defaults[key];
	}

	return item.value;
}

function getWithBrowserCache(key) {
	const item = Settings.findOne({key});
	const localStorageKey = localStoragePrefix + key;
	if (item === undefined) {
		const cached = window.localStorage.getItem(localStorageKey);
		if (cached !== null) return JSON.parse(cached);
		else return defaults[key];
	}

	window.localStorage.setItem(localStorageKey, JSON.stringify(item.value));
	return item.value;
}

function subscribe(key) {
	return Meteor.subscribe('setting', key);
}

const settings = {
	defaults,
	get,
	getWithBrowserCache,
	subscribe,
	methods
};

export {Settings, settings};
