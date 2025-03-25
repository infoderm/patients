import React from 'react';

import Grid from '@mui/material/Grid';

import PatientGridItem from '../patients/PatientGridItem';
import StaticPatientCard from '../patients/StaticPatientCard';

import {usePatientsMissingABirthdate} from '../../api/issues';
import type PropsOf from '../../util/types/PropsOf';

type DivProps = React.JSX.IntrinsicAttributes &
	React.ClassAttributes<HTMLDivElement> &
	React.HTMLAttributes<HTMLDivElement>;
type GridProps = PropsOf<typeof Grid>;
type Props = DivProps & GridProps;

const PatientsMissingABirthdate = (props: Props) => {
	const {loading, results: patients} = usePatientsMissingABirthdate(
		{filter: {}},
		[],
	);

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
