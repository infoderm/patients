import {useMemo} from 'react';
import {useTracker} from 'meteor/react-meteor-data';
import {Settings} from '../api/collection/settings';
import {settings as _settings} from '../api/settings';
import _subscribe from '../api/publication/subscribe';
import byKey from '../api/publication/settings/byKey';
import call from '../api/endpoint/call';
import update from '../api/endpoint/settings/update';

const {defaults, methods} = _settings;

function subscribe(key: string) {
	return _subscribe(byKey, key);
}

function get(key: string) {
	const item = Settings.findOne({key});
	if (item === undefined) {
		return defaults[key];
	}

	return item.value;
}

const localStoragePrefix = 'u3208hfosjas-';
function getWithBrowserCache(key: string) {
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

export const setSetting = async (key: string, newValue: any) => {
	try {
		await call(update, key, newValue);
		console.debug('Setting', key, 'updated to', newValue);
	} catch (error: unknown) {
		console.error({error});
	}
};

export const useSetting = (key: string, getFn = get) => {
	// TODO use only one tracker
	const loading = useTracker(() => {
		const handle = subscribe(key);
		return !handle.ready();
	}, [key]);

	const value = useTracker(() => getFn(key), [key]);

	const setValue = useMemo(
		() => async (newValue: any) => setSetting(key, newValue),
		[key],
	);

	return {
		loading,
		value,
		setValue,
	};
};

export const useSettingCached = (key: string) =>
	useSetting(key, getWithBrowserCache);

export const settings = {
	defaults,
	methods,
	subscribe,
	useSetting,
	get,
	getWithBrowserCache,
};
