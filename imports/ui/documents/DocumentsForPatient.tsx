import React from 'react';

import Loading from '../navigation/Loading';
import NoContent from '../navigation/NoContent';

import type PropsOf from '../../util/types/PropsOf';
import Paginator from '../navigation/Paginator';

import useDocuments from './useDocuments';
import DocumentsForPatientStatic from './DocumentsForPatientStatic';
import DocumentsListAutoFilterToggleButton from './DocumentsListAutoFilterToggleButton';
import useDocumentsListAutoFilter from './useDocumentsListAutoFilter';

type Props = {
	readonly patientId: string;
	readonly loading: boolean;
	readonly found: boolean;
	readonly page?: number;
	readonly perpage?: number;
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
	const [filter, toggleFilter] = useDocumentsListAutoFilter();
	const query = {
		filter: {
			patientId,
			...filter,
			lastVersion: true,
		},
		sort: {datetime: -1} as const,
		skip: (page - 1) * perpage,
		limit: perpage,
	};
	const deps = [JSON.stringify(query)];
	const {loading: loadingDocuments, results: documents} = useDocuments(
		query,
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
			<DocumentsListAutoFilterToggleButton
				filter={filter}
				onClick={toggleFilter}
			/>
		</>
	);
};

export default DocumentsForPatient;
