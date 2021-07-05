import React from 'react';

import usePatient from '../patients/usePatient';
import useDocuments from '../../api/hooks/useDocuments';

import Loading from '../navigation/Loading';
import NoContent from '../navigation/NoContent';

import DocumentsForPatientStatic from './DocumentsForPatientStatic';

const DocumentsForPatient = ({patientId, page, perpage, ...rest}) => {
	const {loading: loadingPatient, found: foundPatient} = usePatient(
		{},
		patientId,
		{fields: {_id: 1}},
		[patientId]
	);
	const query = {
		patientId,
		deleted: false,
		lastVersion: true
	};
	const options = {
		sort: {datetime: -1},
		skip: (page - 1) * perpage,
		limit: perpage
	};
	const deps = [patientId, page, perpage];
	const {loading: loadingDocuments, results: documents} = useDocuments(
		query,
		options,
		deps
	);

	if (loadingPatient) {
		return <Loading />;
	}

	if (!foundPatient) {
		return <NoContent>Patient not found.</NoContent>;
	}

	if (loadingDocuments) {
		return <Loading />;
	}

	return (
		<DocumentsForPatientStatic
			patientId={patientId}
			page={page}
			perpage={perpage}
			documents={documents}
			{...rest}
		/>
	);
};

export default DocumentsForPatient;
