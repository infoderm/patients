import React from 'react';

import {styled} from '@mui/material/styles';
import Typography from '@mui/material/Typography';

const SpacedTypography = styled(Typography)({
	textAlign: 'center',
	margin: '3em 0',
	color: '#999',
});

const NoContent = (props) => <SpacedTypography variant="h3" {...props} />;

export default NoContent;
