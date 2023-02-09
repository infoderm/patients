import React from 'react';
import {useParams} from 'react-router-dom';

import Loading from '../navigation/Loading';
import NoContent from '../navigation/NoContent';

import {Documents} from '../../api/collection/documents';

import useSubscription from '../../api/publication/useSubscription';
import useReactive from '../../api/publication/useReactive';
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

const useDocument = (documentId: DocumentId) => {
	const isLoading = useSubscription(findOne, documentId);
	const loading = isLoading();

	const result = useReactive(() => Documents.findOne(documentId), [documentId]);

	return {
		loading,
		result,
	};
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
