import React from 'react';

import useAttachmentsForPatients from './useAttachmentsForPatients.js';

import Loading from '../navigation/Loading.js';

import AttachmentsForPatientStatic from '../attachments/AttachmentsForPatientStatic.js';

const AttachmentsForPatient = ({patientId, ...rest}) => {
	const {loading, results} = useAttachmentsForPatients([patientId]);

	if (loading) {
		return <Loading />;
	}

	return (
		<AttachmentsForPatientStatic
			patientId={patientId}
			attachmentsInfo={results}
			{...rest}
		/>
	);
};

export default AttachmentsForPatient;
