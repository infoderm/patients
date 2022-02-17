import React from 'react';

import Grid from '@mui/material/Grid';

import StaticPatientCard from './StaticPatientCard';
import CardPatientProjection from './CardPatientProjection';

interface PatientsGridProps<C, T = CardPatientProjection<C> & {_id: string}> {
	patients: T[];
	Card?: React.ElementType;
	CardProps?: {};
	getCardProps?: (patient: T) => {};
	selected?: Set<string>;
}

const PatientsGrid = ({
	patients,
	Card = StaticPatientCard,
	CardProps = undefined,
	getCardProps = undefined,
	selected = undefined,
}: PatientsGridProps<typeof Card>) => (
	<Grid container spacing={3}>
		{patients.map((patient) => (
			<Grid key={patient._id} item xs={12}>
				<Card
					{...CardProps}
					{...getCardProps?.(patient)}
					patient={patient}
					selected={selected?.size ? selected.has(patient._id) : undefined}
				/>
			</Grid>
		))}
	</Grid>
);

export default PatientsGrid;
