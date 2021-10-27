import React from 'react';

import AccordionDetails from '@material-ui/core/AccordionDetails';

import {PermissionTokenDocument} from '../../api/collection/permissionTokens';

interface Props {
	item: PermissionTokenDocument;
}

const PermissionTokenAccordionDetails = ({item}: Props) => (
	<AccordionDetails>
		<pre>{JSON.stringify(item, null, 2)}</pre>
	</AccordionDetails>
);

export default PermissionTokenAccordionDetails;
