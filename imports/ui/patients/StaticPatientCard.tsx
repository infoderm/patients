import React from 'react';

import {Link} from 'react-router-dom';

import type PropsOf from '../../lib/types/PropsOf';

import type CardPatientProjection from './CardPatientProjection';

import GenericStaticPatientCard from './GenericStaticPatientCard';

type StaticPatientCardProps = {
	patient: CardPatientProjection<typeof GenericStaticPatientCard> & {
		_id: string;
	};
} & Omit<
	PropsOf<typeof GenericStaticPatientCard>,
	'patient' | 'component' | 'to' | 'aria-label'
>;

const StaticPatientCard = (props: StaticPatientCardProps) => {
	const firstname = props.patient.firstname! || '?';
	const lastname = props.patient.lastname! || '?';
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
