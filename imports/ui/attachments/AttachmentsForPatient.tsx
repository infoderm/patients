import React from 'react';

import type PropsOf from '../../util/types/PropsOf';

import Loading from '../navigation/Loading';
import NoContent from '../navigation/NoContent';
import usePatient from '../patients/usePatient';

import AttachmentsForPatientStatic from './AttachmentsForPatientStatic';

import useAttachmentsForPatients from './useAttachmentsForPatients';

type Props = Omit<
	PropsOf<typeof AttachmentsForPatientStatic>,
	'attachmentsInfo'
>;

const AttachmentsForPatient = ({patientId, ...rest}: Props) => {
	const {loading: loadingPatient, found: foundPatient} = usePatient(
		{},
		{
			filter: {_id: patientId},
			projection: {_id: 1},
		},
		[patientId],
	);

	const {loading, results} = useAttachmentsForPatients([patientId]);

	if (loadingPatient || loading) {
		return <Loading />;
	}

	if (!foundPatient) {
		return <NoContent>Patient not found.</NoContent>;
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
