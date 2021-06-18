import React from 'react';
import PropTypes from 'prop-types';

import {Link} from 'react-router-dom';

import GenericStaticPatientCard from './GenericStaticPatientCard';

const StaticPatientCard = (props) => (
	<GenericStaticPatientCard
		component={Link}
		to={`/patient/${props.patient._id}`}
		{...props}
	/>
);

StaticPatientCard.projection = GenericStaticPatientCard.projection;

StaticPatientCard.propTypes = {
	patient: PropTypes.object.isRequired
};

export default StaticPatientCard;
