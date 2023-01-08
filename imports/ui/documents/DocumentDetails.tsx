import React from 'react';
import {useParams} from 'react-router-dom';

import {useTracker} from 'meteor/react-meteor-data';

import Loading from '../navigation/Loading';
import NoContent from '../navigation/NoContent';

import {Documents} from '../../api/collection/documents';

import subscribe from '../../api/publication/subscribe';
import findOne from '../../api/publication/documents/findOne';
import {myDecodeURIComponent} from '../../util/uri';
import DocumentCard from './DocumentCard';

type DocumentId = string;

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

const useDocument = (documentId: DocumentId) =>
	useTracker(() => {
		const handle = subscribe(findOne, documentId);
		const loading = !handle.ready();
		return {
			loading,
			result: Documents.findOne(documentId),
		};
	}, [documentId]);

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
