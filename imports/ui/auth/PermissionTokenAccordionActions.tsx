import React from 'react';

import AccordionActions from '@mui/material/AccordionActions';

import {PermissionTokenDocument} from '../../api/collection/permissionTokens';

import PermissionTokenRevocationButton from './PermissionTokenRevocationButton';

interface Props {
	item: PermissionTokenDocument;
}

const PermissionTokenAccordionActions = ({item}: Props) => (
	<AccordionActions>
		<PermissionTokenRevocationButton item={item} />
	</AccordionActions>
);

export default PermissionTokenAccordionActions;
