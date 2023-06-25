import React from 'react';
import {useParams} from 'react-router-dom';

import {myDecodeURIComponent} from '../../lib/uri';

import StaticConsultationDetails from './StaticConsultationDetails';
import useConsultationOrAppointment from './useConsultationOrAppointment';

type Params = {
	id: string;
};

const ConsultationDetails = () => {
	const params = useParams<Params>();
	const consultationId = myDecodeURIComponent(params.id)!;

	const {
		loading,
		found,
		fields: consultation,
	} = useConsultationOrAppointment(
		{},
		{
			filter: {_id: consultationId},
			projection: StaticConsultationDetails.projection,
		},
		[consultationId],
	);

	return (
		// @ts-expect-error Too complex to make it work.
		<StaticConsultationDetails
			loading={loading}
			found={found}
			consultation={consultation}
		/>
	);
};

export default ConsultationDetails;
