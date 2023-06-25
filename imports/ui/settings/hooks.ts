import {useCallback} from 'react';

import {Settings} from '../../api/collection/settings';
import {type UserSettings, type SettingKey, defaults} from '../../api/settings';
import useSubscription from '../../api/publication/useSubscription';
import useReactive from '../../api/publication/useReactive';
import findOneSync from '../../api/publication/findOneSync';
import byKey from '../../api/publication/settings/byKey';
import call from '../../api/endpoint/call';
import update from '../../api/endpoint/settings/update';
import reset from '../../api/endpoint/settings/reset';
import useUserId from '../users/useUserId';
import useLoggingOut from '../users/useLoggingOut';
import useLoggingIn from '../users/useLoggingIn';

const useSettingSubscription = <K extends SettingKey>(key: K) =>
	useSubscription(byKey, key);

const get = <K extends SettingKey>(
	_loading: boolean,
	_userId: string | null,
	key: K,
): UserSettings[K] => {
	const item = findOneSync(Settings, {key});
	return item === undefined ? defaults[key] : item.value;
};

const localStoragePrefix = 'u3208hfosjas';
const localStorageKey = (filter: string, key: string) =>
	`${localStoragePrefix}-${filter}-${key}`;
const defaultFilter = () => 'default';
const userFilter = (userId: string) => `user-${userId}`;
const userOrDefaultFilter = (userId: string | null) =>
	userId === null ? defaultFilter() : userFilter(userId);
const getWithBrowserCache = <K extends SettingKey>(
	loading: boolean,
	userId: string | null,
	key: K,
): UserSettings[K] => {
	// CAREFUL THIS LEAKS IF MULTIPLE USER USE THE APP
	// + clear own cache on logout?!
	// + clear other's cache on login
	// + warning message if cache was found on login
	// OR maybe if not logged in and not logging in clear all cache with
	// warning
	const item = findOneSync(Settings, {key});
	if (item === undefined) {
		if (!loading && userId !== null) {
			window.localStorage.removeItem(localStorageKey(defaultFilter(), key));
			window.localStorage.removeItem(localStorageKey(userFilter(userId), key));

			return defaults[key];
		}

		const cached = window.localStorage.getItem(
			localStorageKey(userOrDefaultFilter(userId), key),
		);
		return cached === null ? defaults[key] : JSON.parse(cached);
	}

	const storedValue = JSON.stringify(item.value);
	window.localStorage.setItem(
		localStorageKey(defaultFilter(), key),
		storedValue,
	);
	if (userId !== null) {
		window.localStorage.setItem(
			localStorageKey(userFilter(userId), key),
			storedValue,
		);
	}

	return item.value;
};

export const setSetting = async <K extends SettingKey>(
	key: K,
	newValue: UserSettings[K],
) => {
	try {
		await call(update, key, newValue);
		console.debug('Setting', key, 'updated to', newValue);
	} catch (error: unknown) {
		console.error({error});
	}
};

export const resetSetting = async <K extends SettingKey>(key: K) => {
	try {
		await call(reset, key);
		console.debug('Setting', key, 'reset');
	} catch (error: unknown) {
		console.error({error});
	}
};

export const useSetting = <K extends SettingKey>(
	key: K,
	getFn: typeof get = get,
) => {
	const userId = useUserId();
	const loggingIn = useLoggingIn();
	const loggingOut = useLoggingOut();
	const isLoadingSetting = useSettingSubscription(key);
	const loadingSetting = isLoadingSetting();

	const loading = loggingIn || loggingOut || loadingSetting;

	const value = useReactive(
		() => getFn<K>(loading, userId, key),
		[getFn, loading, userId, key],
	);

	const setValue = useCallback(
		async (newValue: UserSettings[K]) => setSetting<K>(key, newValue),
		[key],
	);

	const resetValue = useCallback(async () => resetSetting<K>(key), [key]);

	return {
		loading: loadingSetting,
		value,
		setValue,
		resetValue,
	};
};

export const useSettingCached = <K extends SettingKey>(key: K) =>
	useSetting<K>(key, getWithBrowserCache);

export const settings = {
	defaults,
	useSettingSubscription,
	useSetting,
	get,
	getWithBrowserCache,
};
