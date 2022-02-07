import React from 'react';

import Grid from '@mui/material/Grid';

import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(() => ({
	noMargin: {
		width: '100% !important',
		margin: '0 !important',
	},
}));

const GridContainerInsideDialogContent = (props) => {
	const classes = useStyles();
	return <Grid container className={classes.noMargin} {...props} />;
};

export default GridContainerInsideDialogContent;
