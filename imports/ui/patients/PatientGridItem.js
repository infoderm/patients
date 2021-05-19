import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

const PatientGridItem = ({Card, CardProps, ...rest}) => (
	<Grid item xs={12} sm={12} md={12} lg={6} xl={4}>
		<Card {...CardProps} {...rest} />
	</Grid>
);

PatientGridItem.propTypes = {
	Card: PropTypes.elementType.isRequired,
	CardProps: PropTypes.object
};

export default PatientGridItem;
