import React from 'react';

import {useParams} from 'react-router-dom';
import FixedFab from '../button/FixedFab';

import useDocuments from './useDocuments';
import StaticDocumentList from './StaticDocumentList';
import CustomDocumentImportButton from './CustomDocumentImportButton';

interface Params {
	page?: string;
}

interface Props {
	defaultPage?: number;
	defaultPerpage?: number;
}

const DocumentsList = ({defaultPage = 1, defaultPerpage = 10}: Props) => {
	const params = useParams<Params>();
	const page = Number.parseInt(params.page, 10) || defaultPage;
	const perpage = defaultPerpage;

	const options = {
		sort: {createdAt: -1},
		fields: StaticDocumentList.projection,
		skip: (page - 1) * perpage,
		limit: perpage,
	};

	const deps = [page, perpage];

	const {loading, results: documents} = useDocuments({}, options, deps);

	return (
		<>
			<StaticDocumentList
				root="/documents"
				page={page}
				perpage={perpage}
				loading={loading}
				documents={documents}
			/>
			<CustomDocumentImportButton
				Button={FixedFab}
				col={4}
				color="default"
				tooltip="Import documents"
			/>
		</>
	);
};

export default DocumentsList;
