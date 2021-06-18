import React from 'react';

import Grid from '@material-ui/core/Grid';

import PropTypes, {InferProps} from 'prop-types';

import PropsOf from '../../util/PropsOf';

const PatientGridItem = ({
	Card,
	CardProps,
	...rest
}: InferProps<typeof PatientGridItem.propTypes> & PropsOf<typeof Card>) => (
	<Grid item xs={12} sm={12} md={12} lg={6} xl={4}>
		<Card {...CardProps} {...rest} />
	</Grid>
);

PatientGridItem.propTypes = {
	Card: PropTypes.elementType.isRequired,
	CardProps: PropTypes.object
};

export default PatientGridItem;
