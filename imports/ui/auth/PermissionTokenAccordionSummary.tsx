import React from 'react';

import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import {PermissionTokenDocument} from '../../api/collection/permissionTokens';
import {useDateFormatRelative} from '../../i18n/datetime';

interface Props {
	item: PermissionTokenDocument;
}

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
