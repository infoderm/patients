import assert from 'assert';

import {type GridSortModel} from '@mui/x-data-grid';

import {type DocumentDocument} from '../../../api/collection/documents';
import {type Sort} from '../../../api/query/sort';

export const toQuerySort = (
	sortModel: GridSortModel,
): Sort<DocumentDocument> => {
	assert(sortModel.length === 1);
	return {
		[sortModel[0]!.field]: sortModel[0]!.sort === 'asc' ? 1 : -1,
	} as const;
};
