import React from 'react';

import Grid from '@material-ui/core/Grid';

const margin = (x) => (12 - x) / 2 || 12;

const Center = ({children, xs, sm, md, lg, xl, spacing}) => (
	<Grid container spacing={spacing}>
		<Grid
			item
			xs={margin(xs)}
			sm={margin(sm)}
			md={margin(md)}
			lg={margin(lg)}
			xl={margin(xl)}
		/>
		<Grid item xs={xs} sm={sm} md={md} lg={lg} xl={xl}>
			{children}
		</Grid>
	</Grid>
);

Center.defaultProps = {
	xs: 12,
	sm: 12,
	md: 12,
	lg: 6,
	xl: 4,
	spacing: 3
};

export default Center;
