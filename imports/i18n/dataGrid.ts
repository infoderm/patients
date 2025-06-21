import {type GridLocaleText} from '@mui/x-data-grid';

import {get as getSetting} from '../api/settings';

import useLocaleKey from './useLocale';
import {load, useLoadedValue} from './localesCache';

type LocaleText = Partial<GridLocaleText>;

type DataGridLocalization = {
	components: {
		MuiDataGrid: {
			defaultProps: {
				localeText: LocaleText;
			};
		};
	};
};

const dataGridLocalizationLoaders: Readonly<
	Record<string, () => Promise<DataGridLocalization>>
> = {
	'nl-BE': async () =>
		import('@mui/x-data-grid/locales/nlNL.js').then(({nlNL}) => nlNL),
	'fr-BE': async () =>
		import('@mui/x-data-grid/locales/frFR.js').then(({frFR}) => frFR),
};

const loadDataGridLocalization = async (
	key: string,
): Promise<DataGridLocalization | undefined> =>
	dataGridLocalizationLoaders[key]?.();

const dataGridLocalizationsCache = new Map<
	string,
	DataGridLocalization | undefined
>();

const _getDataGridLocalization = async (
	key: string,
): Promise<DataGridLocalization | undefined> => {
	return load<DataGridLocalization | undefined>(
		'dataGrid localization',
		dataGridLocalizationsCache,
		loadDataGridLocalization,
		key,
	);
};

const _dataGridLocalizationToLocaleText = (
	localization: DataGridLocalization | undefined,
) => {
	return localization?.components.MuiDataGrid.defaultProps.localeText;
};

export const getLocaleText = async (
	owner: string,
): Promise<LocaleText | undefined> => {
	const key = await getSetting(owner, 'lang');
	const localization = await _getDataGridLocalization(key);
	return _dataGridLocalizationToLocaleText(localization);
};

const useDataGridLocalization = (key: string) => {
	return useLoadedValue<DataGridLocalization | undefined>(
		'dataGrid localization',
		dataGridLocalizationsCache,
		loadDataGridLocalization,
		key,
	);
};

export const useLocaleText = () => {
	const key = useLocaleKey();
	const localization = useDataGridLocalization(key);
	return _dataGridLocalizationToLocaleText(localization);
};
