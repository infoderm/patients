import React from 'react';

import PropsOf from '../../util/PropsOf';

import eee from '../../util/eee';
import {thumb} from '../../api/attachments';
import AnimatedCardMedia from '../cards/AnimatedCardMedia';
import useAttachment from './useAttachment';

interface AttachmentThumbnailProps
	extends Omit<PropsOf<typeof AnimatedCardMedia>, 'loading' | 'image'> {
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

	return <AnimatedCardMedia {...rest} loading={loading} image={src} />;
};

export default AttachmentThumbnail;
