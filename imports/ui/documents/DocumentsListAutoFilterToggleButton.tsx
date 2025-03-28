import React from 'react';

import FilterListIcon from '@mui/icons-material/FilterList';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';

import FixedFab from '../button/FixedFab';
import {type DocumentDocument} from '../../api/collection/documents';
import type UserFilter from '../../api/query/UserFilter';

type Props = {
	readonly filter?: UserFilter<DocumentDocument>;
	readonly onClick: () => void;
};

const DocumentsListAutoFilterToggleButton = ({filter, onClick}: Props) => {
	const showDeleted = !filter;
	return (
		<FixedFab
			col={5}
			color={showDeleted ? 'primary' : 'default'}
			tooltip={
				showDeleted ? 'Hide deleted documents' : 'Show deleted documents'
			}
			onClick={onClick}
		>
			{showDeleted ? <FilterListOffIcon /> : <FilterListIcon />}
		</FixedFab>
	);
};

export default DocumentsListAutoFilterToggleButton;
