import React from 'react';

import Accordion from '@material-ui/core/Accordion';
import Divider from '@material-ui/core/Divider';

import {PermissionTokenDocument} from '../../api/collection/permissionTokens';

import PermissionTokenAccordionActions from './PermissionTokenAccordionActions';
import PermissionTokenAccordionDetails from './PermissionTokenAccordionDetails';
import PermissionTokenAccordionSummary from './PermissionTokenAccordionSummary';

interface Props {
	item: PermissionTokenDocument;
}

const PermissionTokenAccordion = ({item}: Props) => (
	<Accordion defaultExpanded={false} TransitionProps={{unmountOnExit: true}}>
		<PermissionTokenAccordionSummary item={item} />
		<PermissionTokenAccordionDetails item={item} />
		<Divider />
		<PermissionTokenAccordionActions item={item} />
	</Accordion>
);

export default PermissionTokenAccordion;
