import React from 'react';

import Grid from '@mui/material/Grid';

import PatientGridItem from '../patients/PatientGridItem';
import StaticPatientCard from '../patients/StaticPatientCard';

import {usePatientsMissingABirthdate} from '../../api/issues';

const PatientsMissingABirthdate = (props) => {
	const {loading, results: patients} = usePatientsMissingABirthdate();

	if (loading) {
		return <div {...props}>Loading...</div>;
	}

	if (patients.length === 0) {
		return <div {...props}>All patients have a birthdate :)</div>;
	}

	return (
		<Grid container spacing={3} {...props}>
			{patients.map((patient) => (
				<PatientGridItem
					key={patient._id}
					Card={StaticPatientCard}
					patient={patient}
				/>
			))}
		</Grid>
	);
};

export default PatientsMissingABirthdate;
