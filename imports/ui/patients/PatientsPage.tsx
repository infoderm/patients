import React from 'react';

import Grid from '@mui/material/Grid';

import {PatientDocument} from '../../api/collection/patients';

import PatientGridItem from './PatientGridItem';
import StaticPatientCard from './StaticPatientCard';

interface Props {
	patients: PatientDocument[];
	Card?: React.ElementType;
	NewCard?: React.ElementType;
}

const PatientsPage = ({
	patients,
	Card = StaticPatientCard,
	NewCard = undefined,
}: Props) => {
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
