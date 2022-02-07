import React from 'react';
import {useParams} from 'react-router-dom';

import {myDecodeURIComponent} from '../../util/uri';
import useConsultation from './useConsultation';
import ConsultationEditor from './ConsultationEditor';

type Params = {
	id: string;
};

const EditConsultation = () => {
	const params = useParams<Params>();
	const init = {};
	const query = myDecodeURIComponent(params.id);
	const options = {};
	const deps = [query];

	const {
		loading,
		found,
		fields: consultation,
	} = useConsultation(init, query, options, deps);

	return (
		<ConsultationEditor
			loading={loading}
			found={found}
			consultation={consultation}
		/>
	);
};

export default EditConsultation;
