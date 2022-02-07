import React from 'react';

import Typography from '@mui/material/Typography';

import {link} from '../../api/attachments';

const StaticAttachmentLink = ({
	loading,
	found,
	attachmentId,
	attachment,
	...rest
}) => {
	if (loading) {
		return (
			<Typography variant="body1" {...rest}>
				{attachmentId}
			</Typography>
		);
	}

	if (!found) {
		return (
			<Typography variant="body1" {...rest}>
				{attachmentId} (NOT FOUND)
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
