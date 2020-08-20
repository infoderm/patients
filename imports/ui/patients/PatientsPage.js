import React from 'react';

import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

import StaticPatientCard from './StaticPatientCard.js';
import NewPatientCard from './NewPatientCard.js';

export default function PatientsPage({patients}) {
	return (
		<div>
			<Grid container spacing={3}>
				<NewPatientCard />
				{patients.map((patient) => (
					<StaticPatientCard key={patient._id} patient={patient} />
				))}
			</Grid>
		</div>
	);
}

PatientsPage.projection = StaticPatientCard.projection;

PatientsPage.propTypes = {
	patients: PropTypes.array.isRequired
};
