import React from 'react';

import Typography from '@material-ui/core/Typography';

const link = (attachment) =>
	`/${attachment.link().split('/').slice(3).join('/')}`;

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
			<a
				{...rest}
				href={link(attachment)}
				alt={attachment.name}
				rel="noreferrer"
				target="_blank"
			>
				{attachment.name}
			</a>
		</Typography>
	);
};

export default StaticAttachmentLink;
