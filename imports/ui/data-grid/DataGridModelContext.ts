import {createContext} from 'react';

import {
	type GridCallbackDetails,
	type GridFilterModel,
	type GridPaginationModel,
	type GridSortModel,
} from '@mui/x-data-grid';

type Context = {
	sortModel: GridSortModel;
	filterModel: GridFilterModel;
	paginationModel: GridPaginationModel;

	onSortModelChange: (
		sortModel: GridSortModel,
		details: GridCallbackDetails,
	) => void;
	onFilterModelChange: (
		filterModel: GridFilterModel,
		details: GridCallbackDetails,
	) => void;
	onPaginationModelChange: (
		paginationModel: GridPaginationModel,
		details: GridCallbackDetails,
	) => void;
};

const DataGridModel = createContext<Context>({
	sortModel: [],
	filterModel: {
		items: [],
	},
	paginationModel: {
		page: 0,
		pageSize: 10,
	},
	onSortModelChange() {},
	onFilterModelChange() {},
	onPaginationModelChange() {},
});

export default DataGridModel;
