import {useMemo} from 'react';
import {Meteor} from 'meteor/meteor';
import {useTracker} from 'meteor/react-meteor-data';
import {Settings, settings as _settings} from '../api/settings';

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
	// CAREFUL THIS LEAKS IF MULTIPLE USER USE THE APP
	// TODO AVOID CLASHES BY ADDING USER ID's TO THE KEY?
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

export const setSetting = (key, newValue) => {
	Meteor.call(methods.update, key, newValue, (err) => {
		if (err) {
			console.error(err);
		} else {
			console.debug('Setting', key, 'updated to', newValue);
		}
	});
};

export const useSetting = (key, getFn = get) => {
	// TODO use only one tracker
	const loading = useTracker(() => {
		const handle = subscribe(key);
		return !handle.ready();
	}, [key]);

	const value = useTracker(() => {
		return getFn(key);
	}, [key]);

	const setValue = useMemo(() => {
		return (newValue) => setSetting(key, newValue);
	}, [key, setSetting]);

	return {
		loading,
		value,
		setValue
	};
};

export const useSettingCached = (key) => useSetting(key, getWithBrowserCache);

export const settings = {
	defaults,
	methods,
	subscribe,
	useSetting,
	get,
	getWithBrowserCache
};
