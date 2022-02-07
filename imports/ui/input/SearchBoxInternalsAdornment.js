import React from 'react';

import makeStyles from '@mui/styles/makeStyles';

import SearchIcon from '@mui/icons-material/Search';

const useStyles = makeStyles((theme) => ({
	adornment: {
		display: 'inline-flex',
		width: theme.spacing(9),
		height: '100%',
		position: 'relative',
		pointerEvents: 'none',
		justifyContent: 'center',
	},
}));

export default function SearchBoxInternalsAdornment() {
	const classes = useStyles();

	return (
		<div className={classes.adornment}>
			<SearchIcon />
		</div>
	);
}
