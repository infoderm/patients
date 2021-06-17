import React from 'react';

import PropsOf from '../../util/PropsOf.js';

import Loading from '../navigation/Loading.js';

import AttachmentsForPatientStatic from '../attachments/AttachmentsForPatientStatic.js';

import useAttachmentsForPatients from './useAttachmentsForPatients.js';

type Props = Omit<
	PropsOf<typeof AttachmentsForPatientStatic>,
	'attachmentsInfo'
>;

const AttachmentsForPatient = ({patientId, ...rest}: Props) => {
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
