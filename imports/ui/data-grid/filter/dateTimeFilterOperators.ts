import {type GridColTypeDef} from '@mui/x-data-grid';

import {GridFilterDateTimeInput} from './GridFilterDateTimeInput';
import {serverSideFiltering} from './serverSideFiltering';

export const dateTimeFilterOperators: GridColTypeDef['filterOperators'] = [
	{
		value: 'onOrAfter',
		getApplyFilterFn: serverSideFiltering,
		InputComponent: GridFilterDateTimeInput,
	},
	{
		value: 'after',
		getApplyFilterFn: serverSideFiltering,
		InputComponent: GridFilterDateTimeInput,
	},
	{
		value: 'onOrBefore',
		getApplyFilterFn: serverSideFiltering,
		InputComponent: GridFilterDateTimeInput,
	},
	{
		value: 'before',
		getApplyFilterFn: serverSideFiltering,
		InputComponent: GridFilterDateTimeInput,
	},
];
