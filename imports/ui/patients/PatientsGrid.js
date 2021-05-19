import React from 'react';

import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

import StaticPatientCard from './StaticPatientCard.js';

const PatientsGrid = ({patients, Card, CardProps, selected}) => (
	<Grid container spacing={3}>
		{patients.map((patient) => (
			<Grid key={patient._id} item xs={12}>
				<Card
					{...CardProps}
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
	selected: undefined
};

PatientsGrid.propTypes = {
	patients: PropTypes.array.isRequired,
	Card: PropTypes.elementType,
	CardProps: PropTypes.object,
	selected: PropTypes.object
};

export default PatientsGrid;
