import {defaults} from '../api/settings';
import availableLocales from './availableLocales';

export const navigatorLocale = () => {
	return (
		navigator.languages.find((key) => availableLocales.has(key)) ??
		defaults.lang
	);
};
