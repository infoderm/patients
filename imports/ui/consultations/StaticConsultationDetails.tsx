import React from 'react';
import {styled} from '@mui/material/styles';

import Loading from '../navigation/Loading';
import NoContent from '../navigation/NoContent';

import ReactivePatientChip from '../patients/ReactivePatientChip';
import ReactiveConsultationCard from './ReactiveConsultationCard';

const PREFIX = 'StaticConsultationDetails';

const classes = {
	container: `${PREFIX}-container`,
};

const Root = styled('div')(({theme}) => ({
	[`&.${classes.container}`]: {
		padding: theme.spacing(3),
	},
}));

const StaticConsultationDetails = ({loading, found, consultation}) => {
	if (loading) {
		return <Loading />;
	}

	if (!found) {
		return <NoContent>Consultation not found.</NoContent>;
	}

	return (
		<Root className={classes.container}>
			<ReactiveConsultationCard
				defaultExpanded
				PatientChip={ReactivePatientChip}
				consultation={consultation}
			/>
		</Root>
	);
};

StaticConsultationDetails.projection = ReactiveConsultationCard.projection;

export default StaticConsultationDetails;
