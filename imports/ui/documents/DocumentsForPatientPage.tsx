import React from 'react';

import usePatient from '../patients/usePatient';

import type PropsOf from '../../util/types/PropsOf';

import DocumentsForPatient from './DocumentsForPatient';

type Props = {
	readonly page?: number;
	readonly perpage?: number;
} & Omit<
	PropsOf<typeof DocumentsForPatient>,
	'page' | 'perpage' | 'documents' | 'loading' | 'found'
>;

const DocumentsForPatientPage = ({
	patientId,
	page = 1,
	perpage = 5,
	...rest
}: Props) => {
	const query = {
		filter: {_id: patientId},
		projection: {_id: 1},
	} as const;
	const {loading, found} = usePatient({}, query, [patientId]);
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
