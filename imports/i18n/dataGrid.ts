import {type GridLocaleText} from '@mui/x-data-grid';

import useLocaleKey from './useLocale';
import {useLoadedValue} from './localesCache';

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

const _dataGridLocalizationToLocaleText = (
	localization: DataGridLocalization | undefined,
) => {
	return localization?.components.MuiDataGrid.defaultProps.localeText;
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
