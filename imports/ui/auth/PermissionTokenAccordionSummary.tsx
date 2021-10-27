import React from 'react';

import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import {PermissionTokenDocument} from '../../api/collection/permissionTokens';

interface Props {
	item: PermissionTokenDocument;
}

const PermissionTokenAccordionSummary = ({item}: Props) => (
	<AccordionSummary expandIcon={<ExpandMoreIcon />}>
		{item._id}
	</AccordionSummary>
);

export default PermissionTokenAccordionSummary;
