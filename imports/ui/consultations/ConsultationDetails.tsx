import React from 'react';
import {useParams} from 'react-router-dom';
import {myDecodeURIComponent} from '../../util/uri';

import StaticConsultationDetails from './StaticConsultationDetails';
import useConsultation from './useConsultation';

type Params = {
	id: string;
};

const ConsultationDetails = () => {
	const params = useParams<Params>();
	const init = {};
	const query = myDecodeURIComponent(params.id);
	const options = {fields: StaticConsultationDetails.projection};
	const deps = [query, JSON.stringify(StaticConsultationDetails.projection)];
	const {
		loading,
		found,
		fields: consultation,
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