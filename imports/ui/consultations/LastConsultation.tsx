import React from 'react';

import StaticConsultationDetails from './StaticConsultationDetails';
import ConsultationEditor from './ConsultationEditor';
import useLastConsultation from './useLastConsultation';

const LastConsultation = () => {
	const {loading, found, consultation} = useLastConsultation();

	return consultation?.doneDatetime ? (
		// @ts-expect-error Too complicated to make it work.
		<StaticConsultationDetails
			loading={loading}
			found={found}
			consultation={consultation}
		/>
	) : (
		// @ts-expect-error Too complicated to make it work.
		<ConsultationEditor
			loading={loading}
			found={found}
			consultation={consultation}
		/>
	);
};

export default LastConsultation;
