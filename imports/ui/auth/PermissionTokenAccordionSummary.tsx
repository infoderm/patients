import React from 'react';

import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import {type PermissionTokenDocument} from '../../api/collection/permissionTokens';
import {useDateFormatRelative} from '../../i18n/datetime';

type Props = {
	readonly item: PermissionTokenDocument;
};

const PermissionTokenAccordionSummary = ({item}: Props) => {
	const localizedDateFormatRelative = useDateFormatRelative();
	return (
		<AccordionSummary expandIcon={<ExpandMoreIcon />}>
			{item._id} (last used{' '}
			{localizedDateFormatRelative(item.lastUsedAt, new Date())} from{' '}
			{item.lastUsedIPAddress})
		</AccordionSummary>
	);
};

export default PermissionTokenAccordionSummary;
