import React from 'react';

import {styled} from '@mui/material/styles';

import SearchIcon from '@mui/icons-material/Search';

const PREFIX = 'SearchBoxInternalsAdornment';

const classes = {
	adornment: `${PREFIX}-adornment`,
};

const Root = styled('div')(({theme}) => ({
	[`&.${classes.adornment}`]: {
		display: 'inline-flex',
		width: theme.spacing(9),
		height: '100%',
		position: 'relative',
		pointerEvents: 'none',
		justifyContent: 'center',
	},
}));

export default function SearchBoxInternalsAdornment() {
	return (
		<Root className={classes.adornment}>
			<SearchIcon />
		</Root>
	);
}
