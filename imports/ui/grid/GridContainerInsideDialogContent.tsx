import React from 'react';

import {styled} from '@mui/material/styles';

import Grid from '@mui/material/Grid';

const PREFIX = 'GridContainerInsideDialogContent';

const classes = {
	noMargin: `${PREFIX}-noMargin`,
};

const StyledGrid = styled(Grid)(() => ({
	[`&.${classes.noMargin}`]: {
		width: '100% !important',
		margin: '0 !important',
	},
}));

const GridContainerInsideDialogContent = (props) => {
	return <StyledGrid container className={classes.noMargin} {...props} />;
};

export default GridContainerInsideDialogContent;
