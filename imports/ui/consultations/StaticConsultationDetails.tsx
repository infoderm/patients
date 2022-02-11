import React from 'react';
import {styled} from '@mui/material/styles';

import Loading from '../navigation/Loading';
import NoContent from '../navigation/NoContent';

import ReactivePatientChip from '../patients/ReactivePatientChip';
import {ConsultationDocument} from '../../api/collection/consultations';
import ReactiveConsultationCard from './ReactiveConsultationCard';

const Root = styled('div')(({theme}) => ({
	padding: theme.spacing(3),
}));

interface Props {
	loading: boolean;
	found: boolean;
	consultation: ConsultationDocument;
}

const StaticConsultationDetails = ({loading, found, consultation}: Props) => {
	if (loading) {
		return <Loading />;
	}

	if (!found) {
		return <NoContent>Consultation not found.</NoContent>;
	}

	return (
		<Root>
			<ReactiveConsultationCard
				defaultExpanded
				consultation={consultation}
				PatientChip={ReactivePatientChip}
			/>
		</Root>
	);
};

StaticConsultationDetails.projection = ReactiveConsultationCard.projection;

export default StaticConsultationDetails;
