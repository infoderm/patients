import React from 'react';

import Grid from '@mui/material/Grid';

import type PropsOf from '../../util/types/PropsOf';

type PatientGridItemProps<T> = {
	readonly Card: React.ElementType;
	readonly patient?: T;
};

const PatientGridItem = <T,>({
	Card,
	...rest
}: // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
PatientGridItemProps<T> & PropsOf<typeof Card>) => (
	<Grid item xs={12} sm={12} md={12} lg={6} xl={4}>
		<Card {...rest} />
	</Grid>
);

export default PatientGridItem;
