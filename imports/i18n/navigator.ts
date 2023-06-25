import {useSyncExternalStore} from 'react';

import {defaults} from '../api/settings';
import windowEventSubscription from '../ui/hooks/windowEventSubscription';

import {bestMatch} from './availableLocales';

export const navigatorLanguagesGetSnapshot = () => navigator.languages;
export const navigatorLanguagesSubscribe =
	windowEventSubscription('languagechange');

export const useNavigatorLanguages = () =>
	useSyncExternalStore(
		navigatorLanguagesSubscribe,
		navigatorLanguagesGetSnapshot,
	);

export const navigatorLocale = (navigatorLanguages: readonly string[]) => {
	return (
		navigatorLanguages.map(bestMatch).find((l) => l !== undefined) ??
		defaults.lang
	);
};

export const useNavigatorLocale = () => {
	const navigatorLanguages = useNavigatorLanguages();
	return navigatorLocale(navigatorLanguages);
};
