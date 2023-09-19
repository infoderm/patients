import React from 'react';

import {type DocumentDocument} from '../../api/collection/documents';

import Loading from '../navigation/Loading';
import NoContent from '../navigation/NoContent';
import Paginator from '../navigation/Paginator';

import DocumentsPage from './DocumentsPage';

type Props = {
	readonly page: number;
	readonly perpage: number;
	readonly loading?: boolean;
	readonly documents: DocumentDocument[];
};

const StaticDocumentList = ({
	page,
	perpage,
	loading = false,
	documents,
}: Props) => (
	<>
		<div>
			{loading && documents.length === 0 ? (
				<Loading />
			) : documents.length > 0 ? (
				<DocumentsPage loading={loading} documents={documents} />
			) : (
				<NoContent>{`Nothing to see on page ${page}.`}</NoContent>
			)}
		</div>
		<Paginator loading={loading} end={documents.length < perpage} />
	</>
);

StaticDocumentList.projection = DocumentsPage.projection;

export default StaticDocumentList;
