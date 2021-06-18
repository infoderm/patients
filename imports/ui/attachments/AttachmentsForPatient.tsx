import React from 'react';

import PropsOf from '../../util/PropsOf';

import Loading from '../navigation/Loading';

import AttachmentsForPatientStatic from './AttachmentsForPatientStatic';

import useAttachmentsForPatients from './useAttachmentsForPatients';

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
