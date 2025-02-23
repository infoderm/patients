import {useCallback, useMemo} from 'react';

import {type SettingDocument, Settings} from '../../api/collection/settings';
import {type UserSettings, type SettingKey, defaults} from '../../api/settings';
import useSubscription from '../../api/publication/useSubscription';
import byKey from '../../api/publication/settings/byKey';
import call from '../../api/endpoint/call';
import update from '../../api/endpoint/settings/update';
import reset from '../../api/endpoint/settings/reset';
import useUserId from '../users/useUserId';
import useLoggingOut from '../users/useLoggingOut';
import useLoggingIn from '../users/useLoggingIn';
import useItem from '../../api/publication/useItem';
import {
	TIMEOUT_INPUT_DEBOUNCE,
	TIMEOUT_REACTIVITY_DEBOUNCE,
} from '../constants';
import {useSync} from '../../ux/hooks/useSync';

const useSettingSubscription = <K extends SettingKey>(key: K) =>
	useSubscription(byKey, [key]);

const withDefault = <K extends SettingKey>(
	_loading: boolean,
	_userId: string | null,
	key: K,
	item: SettingDocument | undefined,
): UserSettings[K] => (item === undefined ? defaults[key] : item.value);

const localStoragePrefix = 'u3208hfosjas';
const localStorageKey = (filter: string, key: string) =>
	`${localStoragePrefix}-${filter}-${key}`;
const defaultFilter = () => 'default';
const userFilter = (userId: string) => `user-${userId}`;
const userOrDefaultFilter = (userId: string | null) =>
	userId === null ? defaultFilter() : userFilter(userId);
export const withBrowserCache = <K extends SettingKey>(
	loading: boolean,
	userId: string | null,
	key: K,
	item: SettingDocument | undefined,
): UserSettings[K] => {
	// CAREFUL THIS LEAKS IF MULTIPLE USER USE THE APP
	// + clear own cache on logout?!
	// + clear other's cache on login
	// + warning message if cache was found on login
	// OR maybe if not logged in and not logging in clear all cache with
	// warning
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
	withDefaultFn: typeof withDefault = withDefault,
) => {
	const userId = useUserId();
	const loggingIn = useLoggingIn();
	const loggingOut = useLoggingOut();
	const isLoadingSetting = useSettingSubscription(key);
	const loadingSettingSubscription = isLoadingSetting();

	const loading = loggingIn || loggingOut || loadingSettingSubscription;

	const {loading: loadingSettingResult, result: setting} = useItem(
		Settings,
		{key},
		undefined,
		[key],
	);
	const value = useMemo(
		() => withDefaultFn(loading, userId, key, setting),
		[withDefaultFn, loading, userId, key, setting],
	);

	const setValue = useCallback(
		async (newValue: UserSettings[K]) => setSetting<K>(key, newValue),
		[key],
	);

	const resetValue = useCallback(async () => resetSetting<K>(key), [key]);

	return {
		userId,
		loading: loadingSettingSubscription || loadingSettingResult,
		value,
		setValue,
		resetValue,
	};
};

export const useSettingCached = <K extends SettingKey>(key: K) =>
	useSetting<K>(key, withBrowserCache);

export const useSettingDebounced = <K extends SettingKey>(
	key: K,
	withDefaultFn: typeof withDefault = withDefault,
	inputDebounceTimeout: number = TIMEOUT_INPUT_DEBOUNCE,
	reactivityDebounceTimeout: number = TIMEOUT_REACTIVITY_DEBOUNCE,
) => {
	const {
		userId,
		loading,
		value: serverValue,
		setValue: setServerValue,
		resetValue: resetServerValue,
	} = useSetting(key, withDefaultFn);

	const {
		value: clientValue,
		setValue: setClientValue,
		sync,
	} = useSync(
		loading,
		serverValue,
		inputDebounceTimeout,
		reactivityDebounceTimeout,
	);

	const setValue = useMemo(() => {
		return async (newValue: UserSettings[K]) =>
			sync(
				() => {
					setClientValue(newValue);
				},
				// TODO: Since this is debounced, very quick logout/login
				// cycles (as in tests) will cause the call to target whatever
				// is the current user after the debounce timeout. We should
				// have a way to at least pin the action to a specific user at
				// call time. On top of that, `useSync` should gives us the
				// ability to either `cancel` or `flush` the debounced call
				// queue.
				async () => setServerValue(newValue),
			);
	}, [sync, setClientValue, setServerValue]);

	const resetValue = useMemo(() => {
		return async () =>
			sync(
				() => {
					setClientValue(withDefaultFn(loading, userId, key, undefined));
				},
				// TODO: Since this is debounced, very quick logout/login
				// cycles (as in tests) will cause the call to target whatever
				// is the current user after the debounce timeout. We should
				// have a way to at least pin the action to a specific user at
				// call time. On top of that, `useSync` should gives us the
				// ability to either `cancel` or `flush` the debounced call
				// queue.
				async () => resetServerValue(),
			);
	}, [sync, setClientValue, setServerValue]);

	return {
		loading,
		value: clientValue,
		setValue,
		resetValue,
	};
};

export const settings = {
	defaults,
	useSetting,
};
