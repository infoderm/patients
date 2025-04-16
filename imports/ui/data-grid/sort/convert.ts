import {type GridSortModel} from '@mui/x-data-grid';

import type Document from '../../../api/Document';
import {type Sort} from '../../../api/query/sort';

export const toQuerySort = <T extends Document>(
	sortModel: GridSortModel,
): Sort<T> | undefined => {
	if (sortModel.length === 0) return undefined;
	return Object.fromEntries(
		sortModel.map(({field, sort}) => [field, sort === 'asc' ? 1 : -1]),
	) as Sort<T>;
};
