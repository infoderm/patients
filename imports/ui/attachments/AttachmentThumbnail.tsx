import React from 'react';

import type PropsOf from '../../lib/types/PropsOf';

import eee from '../../lib/png/eee';
import {thumb} from '../../api/attachments';
import AnimatedCardMedia from '../cards/AnimatedCardMedia';

import useAttachment from './useAttachment';

type AttachmentThumbnailProps = {
	readonly attachmentId: string;
	readonly height: number;
	readonly width?: number;
} & Omit<PropsOf<typeof AnimatedCardMedia>, 'loading' | 'image'>;

const AttachmentThumbnail = ({
	attachmentId,
	width,
	height,
	...rest
}: AttachmentThumbnailProps) => {
	const {
		loading,
		found,
		fields: attachment,
	} = useAttachment({}, {filter: {_id: attachmentId}}, [attachmentId]);
	const src = found
		? thumb(attachment, {
				minWidth: width,
				minHeight: height,
		  })
		: eee;

	return <AnimatedCardMedia {...rest} loading={loading} image={src} />;
};

export default AttachmentThumbnail;
