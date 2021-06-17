import React from 'react';

import StaticConsultationDetails from './StaticConsultationDetails.js';
import useConsultation from './useConsultation.js';

const ConsultationDetails = ({match, consultationId}) => {
	const init = {};
	const query = consultationId ?? match.params.id;
	const options = {fields: StaticConsultationDetails.projection};
	const deps = [query, JSON.stringify(StaticConsultationDetails.projection)];
	const {
		loading,
		found,
		fields: consultation
	} = useConsultation(init, query, options, deps);

	return (
		<StaticConsultationDetails
			loading={loading}
			found={found}
			consultation={consultation}
		/>
	);
};

export default ConsultationDetails;
