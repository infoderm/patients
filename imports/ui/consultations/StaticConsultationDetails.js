import React from 'react';
import {makeStyles} from '@material-ui/core/styles';

import Loading from '../navigation/Loading';
import NoContent from '../navigation/NoContent';

import ReactivePatientChip from '../patients/ReactivePatientChip';
import ReactiveConsultationCard from './ReactiveConsultationCard';

const useStyles = makeStyles((theme) => ({
	container: {
		padding: theme.spacing(3),
	},
}));

const StaticConsultationDetails = ({loading, found, consultation}) => {
	const classes = useStyles();

	if (loading) {
		return <Loading />;
	}

	if (!found) {
		return <NoContent>Consultation not found.</NoContent>;
	}

	return (
		<div className={classes.container}>
			<ReactiveConsultationCard
				defaultExpanded
				PatientChip={ReactivePatientChip}
				consultation={consultation}
			/>
		</div>
	);
};

StaticConsultationDetails.projection = ReactiveConsultationCard.projection;

export default StaticConsultationDetails;
