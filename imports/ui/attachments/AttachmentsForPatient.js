import React from 'react';

import {useAttachments} from '../../api/attachments.js';

import Loading from '../navigation/Loading.js';

import AttachmentsForPatientStatic from '../attachments/AttachmentsForPatientStatic.js';

const AttachmentsForPatient = ({patientId, ...rest}) => {
	const query = {patientId: {$in: [patientId]}};
	const options = {
		sort: {
			group: -1
		}
	};
	const deps = [patientId];

	const {loading, results} = useAttachments(query, options, deps);

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
