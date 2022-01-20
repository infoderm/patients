import React from 'react';
import PropTypes from 'prop-types';

import {Link} from 'react-router-dom';

import GenericStaticPatientCard from './GenericStaticPatientCard';

const StaticPatientCard = (props) => {
	const firstname = props.patient.firstname || '?';
	const lastname = props.patient.lastname || '?';
	const ariaLabel = `${firstname} ${lastname}`;
	return (
		<GenericStaticPatientCard
			component={Link}
			to={`/patient/${props.patient._id}`}
			aria-label={ariaLabel}
			{...props}
		/>
	);
};

StaticPatientCard.projection = GenericStaticPatientCard.projection;

StaticPatientCard.propTypes = {
	patient: PropTypes.object.isRequired,
};

export default StaticPatientCard;
