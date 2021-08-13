import React from 'react';
import {match} from 'react-router-dom';

import {Meteor} from 'meteor/meteor';
import {useTracker} from 'meteor/react-meteor-data';
import {Mongo} from 'meteor/mongo';

import Loading from '../navigation/Loading';
import NoContent from '../navigation/NoContent';

import {Documents} from '../../api/documents';
import DocumentCard from './DocumentCard';

type DocumentId = string | Mongo.ObjectID;

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
		// eslint-disable-next-line @typescript-eslint/no-base-to-string
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
		const handle = Meteor.subscribe('document', documentId);
		const loading = !handle.ready();
		return {
			loading,
			result: Documents.findOne(documentId),
		};
	}, [documentId]);

const ReactiveDocumentDetails = ({match}: ReactiveDocumentDetailsProps) => {
	const _id = match.params.id;
	const documentId = _id.length === 24 ? new Mongo.ObjectID(_id) : _id;

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
