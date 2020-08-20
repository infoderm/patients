import React from 'react';

import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';

import Typography from '@material-ui/core/Typography';

import {Uploads} from '../../api/uploads.js';

const link = (attachment) =>
	`/${attachment.link().split('/').slice(3).join('/')}`;

const AttachmentLink = ({loading, attachmentId, attachment, ...rest}) => {
	if (loading) {
		return (
			<Typography variant="body1" {...rest}>
				{attachmentId}
			</Typography>
		);
	}

	return (
		<Typography variant="body1">
			<a {...rest} href={link(attachment)} alt={attachment.name}>
				{attachment.name}
			</a>
		</Typography>
	);
};

export default withTracker(({attachmentId}) => {
	const _id = attachmentId;
	const handle = Meteor.subscribe('upload', _id);
	if (handle.ready()) {
		const attachment = Uploads.findOne(_id);
		return {loading: false, attachment};
	}

	return {loading: true};
})(AttachmentLink);
