import React from 'react';

import Loading from '../navigation/Loading';
import NoContent from '../navigation/NoContent';

import {useConsultationsFind} from '../../api/consultations';
import ConsultationsList from './ConsultationsList';

const PrecedingConsultationsList = ({consultation}) => {
	const query = {
		patientId: consultation.patientId,
		datetime: {
			$lt: consultation.datetime,
		},
	};
	const options = {sort: {datetime: -1}};
	const deps = [JSON.stringify(query)];
	const {loading, results: consultations} = useConsultationsFind(
		query,
		options,
		deps,
	);

	if (loading) return <Loading />;

	if (consultations.length === 0) {
		return <NoContent>There are no preceding consultations</NoContent>;
	}

	return (
		<ConsultationsList
			defaultExpandedFirst
			items={consultations}
			itemProps={{
				attachAction: false,
				editAction: false,
				moreAction: false,
			}}
		/>
	);
};

export default PrecedingConsultationsList;
