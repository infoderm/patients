import React from 'react';

import usePatient from '../patients/usePatient';

import PropsOf from '../../util/PropsOf';
import DocumentsForPatient from './DocumentsForPatient';

interface Props
	extends Omit<
		PropsOf<typeof DocumentsForPatient>,
		'page' | 'perpage' | 'documents'
	> {
	page?: number;
	perpage?: number;
}

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
