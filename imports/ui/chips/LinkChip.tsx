import React from 'react';

import {Link} from 'react-router-dom';

import Chip, {type ChipProps} from '@mui/material/Chip';

const LinkChip = React.forwardRef(
	({to, ...rest}: ChipProps<typeof Link>, ref) => (
		<Chip ref={ref} component={Link} to={to} {...rest} />
	),
);

export default LinkChip;
