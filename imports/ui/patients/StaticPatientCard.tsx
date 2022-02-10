import React from 'react';

import {Link} from 'react-router-dom';

import GenericStaticPatientCard from './GenericStaticPatientCard';

interface Props {
	patient: {
		_id: string;
		firstname: string;
		lastname: string;
	};
}

const StaticPatientCard = (props: Props) => {
	const firstname = props.patient.firstname || '?';
	const lastname = props.patient.lastname || '?';
	const ariaLabel = `${firstname} ${lastname}`;
	return (
		<GenericStaticPatientCard
			// @ts-expect-error No way to branch on Card type.
			component={Link}
			to={`/patient/${props.patient._id}`}
			aria-label={ariaLabel}
			{...props}
		/>
	);
};

StaticPatientCard.projection = GenericStaticPatientCard.projection;

export default StaticPatientCard;
