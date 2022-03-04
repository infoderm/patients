import React from 'react';

import CardMedia from '@mui/material/CardMedia';

import PropsOf from '../../util/PropsOf';

import {link} from '../../api/attachments';
import useAttachment from './useAttachment';
import useThumbnail from './useThumbnail';

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
	const attachmentURL = loading ? undefined : link(attachment);
	const src = useThumbnail(attachmentURL, {
		...attachment,
		minWidth: width,
		minHeight: height,
	});

	if (loading) {
		return <CardMedia {...rest} image={src} />;
	}

	return <CardMedia {...rest} image={src} />;
};

export default AttachmentThumbnail;
