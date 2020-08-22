import React from 'react';

import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

import StaticPatientCard from './StaticPatientCard.js';

export default function PatientsPage({patients, Card, NewCard}) {
	return (
		<div>
			<Grid container spacing={3}>
				{NewCard && <NewCard />}
				{patients.map((patient) => (
					<Card key={patient._id} patient={patient} />
				))}
			</Grid>
		</div>
	);
}

PatientsPage.projection = StaticPatientCard.projection;

PatientsPage.defaultProps = {
	Card: StaticPatientCard,
	NewCard: undefined
};

PatientsPage.propTypes = {
	patients: PropTypes.array.isRequired,
	Card: PropTypes.elementType,
	NewCard: PropTypes.elementType
};
