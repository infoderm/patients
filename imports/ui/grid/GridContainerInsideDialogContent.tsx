import React from 'react';

import {styled} from '@mui/material/styles';

import Grid from '@mui/material/Grid';

const StyledGrid = styled(Grid)({
	width: '100% !important',
	margin: '0 !important',
});

const GridContainerInsideDialogContent = (props) => {
	return <StyledGrid container {...props} />;
};

export default GridContainerInsideDialogContent;
