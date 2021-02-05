import React from 'react';

import CardMedia from '@material-ui/core/CardMedia';

import {link} from '../../api/attachments.js';
import useAttachment from './useAttachment.js';
import useThumbnail from './useThumbnail.js';

const AttachmentThumbnail = ({attachmentId, width, height, ...rest}) => {
	const {loading, fields: attachment} = useAttachment(
		{},
		attachmentId,
		undefined,
		[attachmentId]
	);
	const attachmentURL = loading ? undefined : link(attachment);
	const src = useThumbnail(attachmentURL, {...attachment, width, height});

	if (loading) {
		return <CardMedia {...rest} image={src} alt={attachmentId} />;
	}

	return <CardMedia {...rest} image={src} alt={attachment.name} />;
};

export default AttachmentThumbnail;
