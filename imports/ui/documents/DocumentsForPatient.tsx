import React from 'react';

import Loading from '../navigation/Loading';
import NoContent from '../navigation/NoContent';

import type PropsOf from '../../util/PropsOf';
import Paginator from '../navigation/Paginator';
import useDocuments from './useDocuments';
import DocumentsForPatientStatic from './DocumentsForPatientStatic';

type Props = {
	patientId: string;
	loading: boolean;
	found: boolean;
	page?: number;
	perpage?: number;
} & Omit<
	PropsOf<typeof DocumentsForPatientStatic>,
	'page' | 'perpage' | 'documents'
>;

const DocumentsForPatient = ({
	patientId,
	loading,
	found,
	page = 1,
	perpage = 5,
	...rest
}: Props) => {
	const query = {
		patientId,
		deleted: false,
		lastVersion: true,
	};
	const options = {
		sort: {datetime: -1},
		skip: (page - 1) * perpage,
		limit: perpage,
	};
	const deps = [patientId, page, perpage];
	const {loading: loadingDocuments, results: documents} = useDocuments(
		query,
		options,
		deps,
	);

	if (loading) {
		return <Loading />;
	}

	if (!found) {
		return <NoContent>Patient not found.</NoContent>;
	}

	return (
		<>
			<DocumentsForPatientStatic
				page={page}
				documents={documents}
				loading={loadingDocuments}
				{...rest}
			/>
			<Paginator loading={loadingDocuments} end={documents.length < perpage} />
		</>
	);
};

export default DocumentsForPatient;
