import {useCallback} from 'react';
import {Settings} from '../../api/collection/settings';
import {settings as _settings} from '../../api/settings';
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

const {defaults} = _settings;

const useSettingSubscription = (key: string) => useSubscription(byKey, key);

const get = (_loading: boolean, _userId: string | null, key: string) => {
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
const getWithBrowserCache = (
	loading: boolean,
	userId: string | null,
	key: string,
) => {
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

export const setSetting = async (key: string, newValue: any) => {
	try {
		await call(update, key, newValue);
		console.debug('Setting', key, 'updated to', newValue);
	} catch (error: unknown) {
		console.error({error});
	}
};

export const resetSetting = async (key: string) => {
	try {
		await call(reset, key);
		console.debug('Setting', key, 'reset');
	} catch (error: unknown) {
		console.error({error});
	}
};

export const useSetting = (key: string, getFn: typeof get = get) => {
	const userId = useUserId();
	const loggingIn = useLoggingIn();
	const loggingOut = useLoggingOut();
	const isLoadingSetting = useSettingSubscription(key);
	const loadingSetting = isLoadingSetting();

	const loading = loggingIn || loggingOut || loadingSetting;

	const value = useReactive(
		() => getFn(loading, userId, key),
		[getFn, loading, userId, key],
	);

	const setValue = useCallback(
		async (newValue: any) => setSetting(key, newValue),
		[key],
	);

	const resetValue = useCallback(async () => resetSetting(key), [key]);

	return {
		loading: loadingSetting,
		value,
		setValue,
		resetValue,
	};
};

export const useSettingCached = (key: string) =>
	useSetting(key, getWithBrowserCache);

export const settings = {
	defaults,
	useSettingSubscription,
	useSetting,
	get,
	getWithBrowserCache,
};
