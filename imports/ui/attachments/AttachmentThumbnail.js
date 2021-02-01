import React from 'react';

import CardMedia from '@material-ui/core/CardMedia';

import {Uploads} from '../../api/uploads.js';
import useAttachment from './useAttachment.js';
import useThumbnail from './useThumbnail.js';

const link = (attachment) =>
	`/${Uploads.link(attachment).split('/').slice(3).join('/')}`;

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
