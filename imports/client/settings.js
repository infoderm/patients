import {Meteor} from 'meteor/meteor';
import {useTracker} from 'meteor/react-meteor-data';
import {Settings, settings as _settings} from '../api/settings.js';

const {defaults, methods} = _settings;

function subscribe(key) {
	return Meteor.subscribe('setting', key);
}

function get(key) {
	const item = Settings.findOne({key});
	if (item === undefined) {
		return defaults[key];
	}

	return item.value;
}

const localStoragePrefix = 'u3208hfosjas-';
function getWithBrowserCache(key) {
	const item = Settings.findOne({key});
	const localStorageKey = localStoragePrefix + key;
	if (item === undefined) {
		const cached = window.localStorage.getItem(localStorageKey);
		if (cached !== null) return JSON.parse(cached);
		return defaults[key];
	}

	window.localStorage.setItem(localStorageKey, JSON.stringify(item.value));
	return item.value;
}

export const useSetting = (key) => {

	const loading = useTracker(() => {
		const handle = subscribe(key);
		return !handle.ready();
	}, key);

	const value = useTracker(() => {
		return get(key);
	}, key);

	return {
		loading,
		value
	};

};

export const settings = {
	defaults,
	methods,
	subscribe,
	useSetting,
	get,
	getWithBrowserCache
};
