import React from 'react';

import Typography from '@material-ui/core/Typography';

import {link} from '../../api/attachments.js';

const StaticAttachmentLink = ({loading, attachmentId, attachment, ...rest}) => {
	if (loading) {
		return (
			<Typography variant="body1" {...rest}>
				{attachmentId}
			</Typography>
		);
	}

	return (
		<Typography variant="body1">
			<a {...rest} href={link(attachment)} rel="noreferrer" target="_blank">
				{attachment.name}
			</a>
		</Typography>
	);
};

export default StaticAttachmentLink;
