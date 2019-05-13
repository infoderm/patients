import { Meteor } from 'meteor/meteor' ;
import { withTracker } from 'meteor/react-meteor-data' ;
import { Mongo } from 'meteor/mongo' ;

import React from 'react' ;

import { Documents } from '../../api/documents.js' ;

import DocumentCard from './DocumentCard.js';


function DocumentDetails ({documentId, loading, document}) {

	if (loading) return <div>Loading document #{documentId.toString()}...</div>;
	if (!document) return <div>Error: document #{documentId.toString()} not found.</div>;

	return (
		<div>
			<DocumentCard document={document} defaultExpanded={true}/>
		</div>
	);
}

export default withTracker(({match}) => {
	let _id = match.params.id;
	if ( _id.length === 24 ) _id = new Mongo.ObjectID(_id);
	const handle = Meteor.subscribe('document', _id);
	if ( handle.ready() ) {
		const document = Documents.findOne(_id);
		return { documentId: _id, loading: false, document } ;
	}
	else return { documentId: _id, loading: true } ;
}) (DocumentDetails);
