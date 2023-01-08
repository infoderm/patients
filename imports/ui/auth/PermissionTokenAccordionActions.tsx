import React from 'react';

import AccordionActions from '@mui/material/AccordionActions';

import {type PermissionTokenDocument} from '../../api/collection/permissionTokens';

import PermissionTokenRevocationButton from './PermissionTokenRevocationButton';

type Props = {
	item: PermissionTokenDocument;
};

const PermissionTokenAccordionActions = ({item}: Props) => (
	<AccordionActions>
		<PermissionTokenRevocationButton item={item} />
	</AccordionActions>
);

export default PermissionTokenAccordionActions;
