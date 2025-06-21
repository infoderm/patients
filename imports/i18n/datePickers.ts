import {type PickersLocaleText} from '@mui/x-date-pickers';

import {get as getSetting} from '../api/settings';

import useLocaleKey from './useLocale';
import {load, useLoadedValue} from './localesCache';

type LocaleText = Partial<PickersLocaleText<any>>;

type PickersLocalization = {
	components: {
		MuiLocalizationProvider: {
			defaultProps: {
				localeText: LocaleText;
			};
		};
	};
};

const pickersLocalizationLoaders: Readonly<
	Record<string, () => Promise<PickersLocalization>>
> = {
	'nl-BE': async () =>
		import('@mui/x-date-pickers/locales/nlNL.js').then(({nlNL}) => nlNL),
	'fr-BE': async () =>
		import('@mui/x-date-pickers/locales/frFR.js').then(({frFR}) => frFR),
};

const loadPickersLocalization = async (
	key: string,
): Promise<PickersLocalization | undefined> =>
	pickersLocalizationLoaders[key]?.();

const pickersLocalizationsCache = new Map<
	string,
	PickersLocalization | undefined
>();

const _getPickersLocalization = async (
	key: string,
): Promise<PickersLocalization | undefined> => {
	return load<PickersLocalization | undefined>(
		'pickers localization',
		pickersLocalizationsCache,
		loadPickersLocalization,
		key,
	);
};

const _pickersLocalizationToLocaleText = (
	localization: PickersLocalization | undefined,
) => {
	return localization?.components.MuiLocalizationProvider.defaultProps
		.localeText;
};

export const getLocaleText = async (
	owner: string,
): Promise<LocaleText | undefined> => {
	const key = await getSetting(owner, 'lang');
	const localization = await _getPickersLocalization(key);
	return _pickersLocalizationToLocaleText(localization);
};

const usePickersLocalization = (key: string) => {
	return useLoadedValue<PickersLocalization | undefined>(
		'pickers localization',
		pickersLocalizationsCache,
		loadPickersLocalization,
		key,
	);
};

export const useLocaleText = () => {
	const key = useLocaleKey();
	const localization = usePickersLocalization(key);
	return _pickersLocalizationToLocaleText(localization);
};
