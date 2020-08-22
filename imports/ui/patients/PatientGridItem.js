import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

const PatientGridItem = ({Card, ...rest}) => (
	<Grid item sm={12} md={12} lg={6} xl={4}>
		<Card {...rest} />
	</Grid>
);

PatientGridItem.propTypes = {
	Card: PropTypes.elementType.isRequired
};

export default PatientGridItem;
