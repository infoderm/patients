import React from 'react';

import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

import PatientGridItem from './PatientGridItem';
import StaticPatientCard from './StaticPatientCard';

export default function PatientsPage({patients, Card, NewCard}) {
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
}

PatientsPage.projection = StaticPatientCard.projection;

PatientsPage.defaultProps = {
	Card: StaticPatientCard,
	NewCard: undefined,
};

PatientsPage.propTypes = {
	patients: PropTypes.array.isRequired,
	Card: PropTypes.elementType,
	NewCard: PropTypes.elementType,
};
