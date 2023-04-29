import {useEffect, useState} from 'react';
import {defaults} from '../api/settings';
import availableLocales, {type AvailableLocale} from './availableLocales';

export const navigatorLocale = () => {
	return (
		navigator.languages.find((key) =>
			availableLocales.has(key as AvailableLocale),
		) ?? defaults.lang
	);
};

export const useNavigatorLocale = () => {
	const [state, setState] = useState(navigatorLocale());

	useEffect(() => {
		const handleEvent = () => {
			setState(navigatorLocale());
		};

		window.addEventListener('languagechange', handleEvent);

		// NOTE Simulate synthetic event in case any event occurred before we
		// could subscribe.
		handleEvent();

		return () => {
			window.removeEventListener('languagechange', handleEvent);
		};
	}, []);

	return state;
};
