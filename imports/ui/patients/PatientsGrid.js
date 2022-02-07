import React from 'react';

import PropTypes from 'prop-types';

import Grid from '@mui/material/Grid';

import StaticPatientCard from './StaticPatientCard';

const PatientsGrid = ({patients, Card, CardProps, getCardProps, selected}) => (
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

PatientsGrid.projection = StaticPatientCard.projection;

PatientsGrid.defaultProps = {
	Card: StaticPatientCard,
	CardProps: undefined,
	getCardProps: undefined,
	selected: undefined,
};

PatientsGrid.propTypes = {
	patients: PropTypes.array.isRequired,
	Card: PropTypes.elementType,
	CardProps: PropTypes.object,
	getCardProps: PropTypes.func,
	selected: PropTypes.object,
};

export default PatientsGrid;
