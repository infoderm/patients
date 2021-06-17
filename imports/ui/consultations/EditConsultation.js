import React from 'react';

import useConsultation from './useConsultation.js';
import ConsultationEditor from './ConsultationEditor.js';

const EditConsultationForm = ({match}) => {
	const init = {};
	const query = match.params.id;
	const options = {};
	const deps = [query];

	const {
		loading,
		found,
		fields: consultation
	} = useConsultation(init, query, options, deps);

	return (
		<ConsultationEditor
			loading={loading}
			found={found}
			consultation={consultation}
		/>
	);
};

export default EditConsultationForm;
