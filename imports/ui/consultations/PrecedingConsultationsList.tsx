import React from 'react';

import Loading from '../navigation/Loading';
import NoContent from '../navigation/NoContent';

import useConsultationsUnpaged from './useConsultationsUnpaged';
import ConsultationsList from './ConsultationsList';

const PrecedingConsultationsList = ({consultation}) => {
	const query = {
		filter: {
			patientId: consultation.patientId,
			datetime: {
				$lt: consultation.datetime,
			},
		},
		sort: {datetime: -1} as const,
	};
	const deps = [JSON.stringify(query)];
	const {loading, results: consultations} = useConsultationsUnpaged(
		query,
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
