import React from 'react';

import StaticConsultationDetails from './StaticConsultationDetails';
import ConsultationEditor from './ConsultationEditor';
import useLastConsultation from './useLastConsultation';

const LastConsultation = () => {
	const {loading, found, consultation} = useLastConsultation();

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
