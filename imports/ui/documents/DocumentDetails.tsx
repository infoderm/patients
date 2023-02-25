import React from 'react';
import {useParams} from 'react-router-dom';

import Loading from '../navigation/Loading';
import NoContent from '../navigation/NoContent';

import {myDecodeURIComponent} from '../../lib/uri';
import {type DocumentId} from '../../api/collection/documents';
import DocumentCard from './DocumentCard';
import useDocument from './useDocument';

type StaticDocumentDetailsProps = {
	documentId: DocumentId;
	loading: boolean;
	document: any;
};

const StaticDocumentDetails = ({
	documentId,
	loading,
	document,
}: StaticDocumentDetailsProps) => {
	if (loading) {
		return <Loading />;
	}

	if (!document) {
		return <NoContent>Document #{documentId.toString()} not found.</NoContent>;
	}

	return (
		<div>
			<DocumentCard defaultExpanded document={document} />
		</div>
	);
};

type Params = {
	id: string;
};

const ReactiveDocumentDetails = () => {
	const params = useParams<Params>();
	const documentId = myDecodeURIComponent(params.id);

	const {loading, result: document} = useDocument(documentId);
	return (
		<StaticDocumentDetails
			documentId={documentId}
			loading={loading}
			document={document}
		/>
	);
};

export default ReactiveDocumentDetails;
