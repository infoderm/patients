import React from 'react';

import Loading from '../navigation/Loading.js';
import NoContent from '../navigation/NoContent.js';

import {useConsultationsFind} from '../../api/consultations.js';
import ConsultationsList from './ConsultationsList.js';

const PrecedingConsultationsList = ({consultation}) => {
	const query = {
		patientId: consultation.patientId,
		datetime: {
			$lt: consultation.datetime
		}
	};
	const options = {sort: {datetime: -1}};
	const deps = [JSON.stringify(query)];
	const {loading, results: consultations} = useConsultationsFind(
		query,
		options,
		deps
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
				deleteAction: false
			}}
		/>
	);
};

export default PrecedingConsultationsList;
