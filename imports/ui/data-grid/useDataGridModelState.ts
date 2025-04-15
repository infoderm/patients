import {useCallback, useState} from 'react';

import {
	type GridCallbackDetails,
	type GridFilterModel,
	type GridPaginationModel,
	type GridSortModel,
} from '@mui/x-data-grid';

const useDataGridModelState = () => {
	const [sortModel, setSortModel] = useState<GridSortModel>([]);
	const [filterModel, setFilterModel] = useState<GridFilterModel>({items: []});
	const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
		page: 0,
		pageSize: 10,
	});

	const onSortModelChange = useCallback(
		(sortModel: GridSortModel, details: GridCallbackDetails) => {
			console.debug({sortModel, details});
			setSortModel(sortModel);
		},
		[],
	);

	const onFilterModelChange = useCallback(
		(filterModel: GridFilterModel, details: GridCallbackDetails) => {
			console.debug(JSON.stringify({filterModel, details}));
			setFilterModel(filterModel);
		},
		[],
	);

	const onPaginationModelChange = useCallback(
		(paginationModel: GridPaginationModel, details: GridCallbackDetails) => {
			console.debug({paginationModel, details});
			setPaginationModel(paginationModel);
		},
		[],
	);

	return {
		sortModel,
		filterModel,
		paginationModel,
		onSortModelChange,
		onFilterModelChange,
		onPaginationModelChange,
	};
};

export default useDataGridModelState;
