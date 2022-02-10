import React from 'react';
import {styled} from '@mui/material/styles';

import Loading from '../navigation/Loading';
import NoContent from '../navigation/NoContent';

import ReactiveConsultationCard from './ReactiveConsultationCard';

const Root = styled('div')(({theme}) => ({
	padding: theme.spacing(3),
}));

const StaticConsultationDetails = ({loading, found, consultation}) => {
	if (loading) {
		return <Loading />;
	}

	if (!found) {
		return <NoContent>Consultation not found.</NoContent>;
	}

	return (
		<Root>
			<ReactiveConsultationCard defaultExpanded consultation={consultation} />
		</Root>
	);
};

StaticConsultationDetails.projection = ReactiveConsultationCard.projection;

export default StaticConsultationDetails;
