import React from 'react';
import {match} from 'react-router-dom';

import {useTracker} from 'meteor/react-meteor-data';

import Loading from '../navigation/Loading';
import NoContent from '../navigation/NoContent';

import {Documents} from '../../api/collection/documents';

import subscribe from '../../api/publication/subscribe';
import findOne from '../../api/publication/documents/findOne';
import DocumentCard from './DocumentCard';

type DocumentId = string;

interface StaticDocumentDetailsProps {
	documentId: DocumentId;
	loading: boolean;
	document: any;
}

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

interface Params {
	id: string;
}

interface ReactiveDocumentDetailsProps {
	match: match<Params>;
}

const useDocument = (documentId: DocumentId) =>
	useTracker(() => {
		const handle = subscribe(findOne, documentId);
		const loading = !handle.ready();
		return {
			loading,
			result: Documents.findOne(documentId),
		};
	}, [documentId]);

const ReactiveDocumentDetails = ({match}: ReactiveDocumentDetailsProps) => {
	const documentId = match.params.id;

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
