import React from 'react';

import usePatient from '../patients/usePatient';

import type PropsOf from '../../lib/types/PropsOf';
import DocumentsForPatient from './DocumentsForPatient';

type Props = {
	page?: number;
	perpage?: number;
} & Omit<PropsOf<typeof DocumentsForPatient>, 'page' | 'perpage' | 'documents'>;

const DocumentsForPatientPage = ({
	patientId,
	page = 1,
	perpage = 5,
	...rest
}: Props) => {
	const {loading, found} = usePatient({}, patientId, {fields: {_id: 1}}, [
		patientId,
	]);
	return (
		<DocumentsForPatient
			patientId={patientId}
			loading={loading}
			found={found}
			page={page}
			perpage={perpage}
			{...rest}
		/>
	);
};

export default DocumentsForPatientPage;
