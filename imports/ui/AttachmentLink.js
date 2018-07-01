import React from 'react';
import { withTracker } from 'meteor/react-meteor-data' ;

import { Uploads } from '../api/uploads.js';

const AttachmentLink = ( { loading, attachmentId, attachment , ...rest } ) => {
  if ( loading ) return (<span {...rest}>{attachmentId}</span>);
  else return (
    <a {...rest} href={attachment.link()} alt={attachment.name}>{attachment.name}</a>
  ) ;
} ;

export default withTracker( ( { attachmentId } ) => {
	const _id = attachmentId;
	const handle = Meteor.subscribe('upload', _id);
	if ( handle.ready() ) {
		const attachment = Uploads.findOne(_id);
		return { loading: false, attachment } ;
	}
	else return { loading: true } ;
}) ( AttachmentLink );
