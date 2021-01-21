import React from 'react';
import {makeStyles} from '@material-ui/core/styles';

import {useConsultation} from '../../api/consultations.js';

import Loading from '../navigation/Loading.js';
import NoContent from '../navigation/NoContent.js';

import ReactiveConsultationCard from './ReactiveConsultationCard.js';
import ReactivePatientChip from '../patients/ReactivePatientChip.js';

const useStyles = makeStyles((theme) => ({
	container: {
		padding: theme.spacing(3)
	}
}));

const ConsultationDetails = ({match}) => {
	const classes = useStyles();

	const _id = match.params.id;
	const options = {fields: ReactiveConsultationCard.projection};
	const deps = [_id, JSON.stringify(ReactiveConsultationCard.projection)];
	const {loading, found, fields: consultation} = useConsultation(
		{},
		_id,
		options,
		deps
	);

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

export default ConsultationDetails;
