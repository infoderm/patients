import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';

import React from 'react';

import {Documents} from '../../api/documents.js';

import DocumentsPage from '../documents/DocumentsPage.js';

const UnparsedDocuments = ({loading, documents, ...rest}) => {
	if (loading) {
		return <div {...rest}>Loading...</div>;
	}

	if (documents.length === 0) {
		return <div {...rest}>All documents have been parsed :)</div>;
	}

	return (
		<div {...rest}>
			<DocumentsPage documents={documents} />
		</div>
	);
};

export default withTracker(() => {
	const options = {
		sort: {
			createdAt: 1
		},
		fields: {
			...DocumentsPage.projection
			// Parsed: 1,
		}
	};
	const handle = Meteor.subscribe('documents.unparsed', options);
	if (!handle.ready()) {
		return {loading: true};
	}

	return {
		loading: false,
		documents: Documents.find(
			{
				parsed: false
			},
			options
		).fetch()
	};
})(UnparsedDocuments);
