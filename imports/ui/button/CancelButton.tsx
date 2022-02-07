import React from 'react';

import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';

import PropsOf from '../../util/PropsOf';

const CancelButton = (props: PropsOf<typeof Button>) => (
	<Button endIcon={<CancelIcon />} {...props}>
		Cancel
	</Button>
);

export default CancelButton;
