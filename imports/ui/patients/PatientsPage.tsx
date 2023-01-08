import React from 'react';

import Grid from '@mui/material/Grid';

import PatientGridItem from './PatientGridItem';
import StaticPatientCard from './StaticPatientCard';
import type CardPatientProjection from './CardPatientProjection';

type PatientPageProps<C, T = CardPatientProjection<C> & {_id: string}> = {
	patients: T[];
	Card?: React.ElementType;
	NewCard?: React.ElementType;
};

const PatientsPage = ({
	patients,
	Card = StaticPatientCard,
	NewCard = undefined,
}: PatientPageProps<typeof Card>) => {
	return (
		<div>
			<Grid container spacing={3}>
				{NewCard && <PatientGridItem Card={NewCard} />}
				{patients.map((patient) => (
					<PatientGridItem key={patient._id} Card={Card} patient={patient} />
				))}
			</Grid>
		</div>
	);
};

PatientsPage.projection = StaticPatientCard.projection;

export default PatientsPage;
