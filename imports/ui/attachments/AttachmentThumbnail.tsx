import React from 'react';

import CardMedia from '@mui/material/CardMedia';

import Skeleton from '@mui/material/Skeleton';
import PropsOf from '../../util/PropsOf';

import eee from '../../util/eee';
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
		? eee
		: thumb(attachment, {
				minWidth: width,
				minHeight: height,
		  });

	if (loading) {
		return (
			<Skeleton variant="rectangular" width="100%">
				<CardMedia {...rest} image={src} />
			</Skeleton>
		);
	}

	return <CardMedia {...rest} image={src} />;
};

export default AttachmentThumbnail;
