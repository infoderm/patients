import React from 'react';

import StaticConsultationDetails from './StaticConsultationDetails.js';
import ConsultationEditor from './ConsultationEditor.js';
import useLastConsultation from './useLastConsultation.js';

const LastConsultation = () => {
	const {loading, consultation} = useLastConsultation();
	const found = Boolean(consultation);

	return consultation?.doneDatetime ? (
		<StaticConsultationDetails
			loading={loading}
			found={found}
			consultation={consultation}
		/>
	) : (
		<ConsultationEditor
			loading={loading}
			found={found}
			consultation={consultation}
		/>
	);
};

export default LastConsultation;
