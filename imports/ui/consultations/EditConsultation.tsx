import React from 'react';
import {useParams} from 'react-router-dom';

import {myDecodeURIComponent} from '../../lib/uri';

import useConsultation from './useConsultation';
import ConsultationEditor from './ConsultationEditor';

type Params = {
	id: string;
};

const EditConsultation = () => {
	const params = useParams<Params>();
	const consultationId = myDecodeURIComponent(params.id)!;

	const {
		loading,
		found,
		fields: consultation,
	} = useConsultation({}, {filter: {_id: consultationId}}, [consultationId]);

	return (
		// @ts-expect-error Too complicated to make it work.
		<ConsultationEditor
			loading={loading}
			found={found}
			consultation={consultation}
		/>
	);
};

export default EditConsultation;
