import {defaults} from '../api/settings';
import availableLocales, {type AvailableLocale} from './availableLocales';

export const navigatorLocale = () => {
	return (
		navigator.languages.find((key) =>
			availableLocales.has(key as AvailableLocale),
		) ?? defaults.lang
	);
};
