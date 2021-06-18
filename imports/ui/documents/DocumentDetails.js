import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';
import {Mongo} from 'meteor/mongo';

import React from 'react';

import Loading from '../navigation/Loading';
import NoContent from '../navigation/NoContent';

import {Documents} from '../../api/documents';
import DocumentCard from './DocumentCard';

const DocumentDetails = ({documentId, loading, document}) => {
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

export default withTracker(({match}) => {
	let _id = match.params.id;
	if (_id.length === 24) {
		_id = new Mongo.ObjectID(_id);
	}

	const handle = Meteor.subscribe('document', _id);
	if (handle.ready()) {
		const document = Documents.findOne(_id);
		return {documentId: _id, loading: false, document};
	}

	return {documentId: _id, loading: true};
})(DocumentDetails);
