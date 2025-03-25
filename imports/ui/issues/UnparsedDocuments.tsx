import React from 'react';

import {useUnparsedDocuments} from '../../api/issues';

import DocumentsPage from '../documents/DocumentsPage';

type Props = React.JSX.IntrinsicAttributes &
	React.ClassAttributes<HTMLDivElement> &
	React.HTMLAttributes<HTMLDivElement>;

const UnparsedDocuments = (props: Props) => {
	const {loading, results: documents} = useUnparsedDocuments(
		{
			filter: {},
			sort: {
				createdAt: 1,
			},
			projection: {
				...DocumentsPage.projection,
				// parsed: 1,
				// createdAt: 1
			},
		},
		[],
	);

	if (loading) {
		return <div {...props}>Loading...</div>;
	}

	if (documents.length === 0) {
		return <div {...props}>All documents have been parsed :)</div>;
	}

	return (
		<div {...props}>
			<DocumentsPage documents={documents} />
		</div>
	);
};

export default UnparsedDocuments;
