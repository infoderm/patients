import {type GridColTypeDef} from '@mui/x-data-grid';

import {GridFilterBooleanInput} from './GridFilterBooleanInput';
import {serverSideFiltering} from './serverSideFiltering';

export const booleanFilterOperators: GridColTypeDef['filterOperators'] = [
	{
		value: 'is',
		getApplyFilterFn: serverSideFiltering,
		InputComponent: GridFilterBooleanInput,
	},
];
