import React from 'react';

import FixedFab from '../button/FixedFab';

import useDocuments from './useDocuments';
import StaticDocumentList from './StaticDocumentList';
import CustomDocumentImportButton from './CustomDocumentImportButton';

type Props = {
	page?: number;
	perpage?: number;
};

const DocumentsList = ({page = 1, perpage = 10}: Props) => {
	const query = {
		filter: {},
		sort: {createdAt: -1} as const,
		projection: StaticDocumentList.projection,
		skip: (page - 1) * perpage,
		limit: perpage,
	};

	const deps = [page, perpage];

	const {loading, results: documents} = useDocuments(query, deps);

	return (
		<>
			<StaticDocumentList
				page={page}
				perpage={perpage}
				loading={loading}
				documents={documents}
			/>
			<CustomDocumentImportButton
				Button={FixedFab}
				col={4}
				tooltip="Import documents"
			/>
		</>
	);
};

export default DocumentsList;
