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
	readonly LoadingIndicator?: React.ElementType<{}>;
	readonly EmptyPage?: React.ElementType<{page: number}>;
};

const DefaultLoadingIndicator = Loading;
const DefaultEmptyPage = ({page}: {readonly page: number}) => (
	<NoContent>{`Nothing to see on page ${page}.`}</NoContent>
);

const StaticDocumentList = ({
	page,
	perpage,
	loading = false,
	documents,
	LoadingIndicator = DefaultLoadingIndicator,
	EmptyPage = DefaultEmptyPage,
}: Props) => (
	<>
		<div>
			{loading && documents.length === 0 ? (
				<LoadingIndicator />
			) : documents.length > 0 ? (
				<DocumentsPage loading={loading} documents={documents} />
			) : (
				<EmptyPage page={page} />
			)}
		</div>
		<Paginator loading={loading} end={documents.length < perpage} />
	</>
);

StaticDocumentList.projection = DocumentsPage.projection;

export default StaticDocumentList;
