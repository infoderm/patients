import React from 'react';

import Button from '@material-ui/core/Button';
import CancelIcon from '@material-ui/icons/Cancel';

import PropsOf from '../../util/PropsOf';

const CancelButton = (props: PropsOf<typeof Button>) => (
	<Button color="default" endIcon={<CancelIcon />} {...props}>
		Cancel
	</Button>
);

export default CancelButton;
