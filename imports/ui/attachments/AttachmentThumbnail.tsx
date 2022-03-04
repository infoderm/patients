import React from 'react';

import CardMedia from '@mui/material/CardMedia';

import PropsOf from '../../util/PropsOf';

import {thumb} from '../../api/attachments';
import useAttachment from './useAttachment';

interface AttachmentThumbnailProps extends PropsOf<typeof CardMedia> {
	attachmentId: string;
	height: number;
	width?: number;
}

const AttachmentThumbnail = ({
	attachmentId,
	width,
	height,
	...rest
}: AttachmentThumbnailProps) => {
	const {loading, fields: attachment} = useAttachment(
		{},
		attachmentId,
		undefined,
		[attachmentId],
	);
	const src = loading
		? undefined
		: thumb(attachment, {
				minWidth: width,
				minHeight: height,
		  });

	if (loading) {
		return <CardMedia {...rest} image={src} />;
	}

	return <CardMedia {...rest} image={src} />;
};

export default AttachmentThumbnail;
