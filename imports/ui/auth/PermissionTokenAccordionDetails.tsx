import React from 'react';

import AccordionDetails from '@mui/material/AccordionDetails';

import {type PermissionTokenDocument} from '../../api/collection/permissionTokens';

type Props = {
	item: PermissionTokenDocument;
};

const PermissionTokenAccordionDetails = ({item}: Props) => (
	<AccordionDetails>
		<pre>{JSON.stringify(item, null, 2)}</pre>
	</AccordionDetails>
);

export default PermissionTokenAccordionDetails;
