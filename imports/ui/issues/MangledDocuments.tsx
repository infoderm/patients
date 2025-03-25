import React from 'react';

import {useMangledDocuments} from '../../api/issues';

import DocumentsPage from '../documents/DocumentsPage';

type Props = React.JSX.IntrinsicAttributes &
	React.ClassAttributes<HTMLDivElement> &
	React.HTMLAttributes<HTMLDivElement>;

const MangledDocuments = (props: Props) => {
	const {loading, results: documents} = useMangledDocuments(
		{
			filter: {},
			sort: {
				createdAt: 1,
			},
			projection: {
				...DocumentsPage.projection,
				// encoding: 1,
				// createdAt: 1
			},
		},
		[],
	);

	if (loading) {
		return <div {...props}>Loading...</div>;
	}

	if (documents.length === 0) {
		return <div {...props}>All documents have been decoded :)</div>;
	}

	return (
		<div {...props}>
			<DocumentsPage documents={documents} />
		</div>
	);
};

export default MangledDocuments;
