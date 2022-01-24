import React from 'react';
import PropTypes from 'prop-types';

import FixedFab from '../button/FixedFab';

import useDocuments from './useDocuments';
import StaticDocumentList from './StaticDocumentList';
import CustomDocumentImportButton from './CustomDocumentImportButton';

const DocumentsList = ({match, page, perpage}) => {
	page =
		(match?.params.page && Number.parseInt(match.params.page, 10)) ||
		page ||
		DocumentsList.defaultProps.page;
	perpage = perpage || DocumentsList.defaultProps.perpage;

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

DocumentsList.defaultProps = {
	page: 1,
	perpage: 10,
};

DocumentsList.propTypes = {
	page: PropTypes.number,
	perpage: PropTypes.number,
};

export default DocumentsList;
