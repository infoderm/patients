import React from 'react';

import Grid from '@mui/material/Grid';

import PropsOf from '../../util/PropsOf';

interface PatientGridItemProps<C> {
	Card: C;
}

const PatientGridItem = <C extends React.ElementType>({
	Card,
	...rest
}: PatientGridItemProps<C> & PropsOf<C>) => (
	<Grid item xs={12} sm={12} md={12} lg={6} xl={4}>
		<Card {...rest} />
	</Grid>
);

export default PatientGridItem;
