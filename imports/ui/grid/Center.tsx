import React from 'react';

import Grid, {GridProps} from '@material-ui/core/Grid';

const Center = ({
	xs = 12,
	sm = 12,
	md = 12,
	lg = 6,
	xl = 4,
	spacing = 3,
	...rest
}: GridProps) => (
	<Grid container spacing={spacing} justify="center" alignItems="center">
		<Grid item xs={xs} sm={sm} md={md} lg={lg} xl={xl} {...rest} />
	</Grid>
);

export default Center;
