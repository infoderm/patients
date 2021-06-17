import React from 'react';
import PropTypes, {InferProps} from 'prop-types';

import CardMedia from '@material-ui/core/CardMedia';

import PropsOf from '../../util/PropsOf.js';

import {link} from '../../api/attachments.js';
import useAttachment from './useAttachment.js';
import useThumbnail from './useThumbnail.js';

const propTypes = {
	attachmentId: PropTypes.string.isRequired,
	height: PropTypes.number.isRequired,
	width: PropTypes.number
};

type Props = InferProps<typeof propTypes> & PropsOf<typeof CardMedia>;

const AttachmentThumbnail = ({attachmentId, width, height, ...rest}: Props) => {
	const {loading, fields: attachment} = useAttachment(
		{},
		attachmentId,
		undefined,
		[attachmentId]
	);
	const attachmentURL = loading ? undefined : link(attachment);
	const src = useThumbnail(attachmentURL, {...attachment, width, height});

	if (loading) {
		return <CardMedia {...rest} image={src} />;
	}

	return <CardMedia {...rest} image={src} />;
};

AttachmentThumbnail.propTypes = propTypes;

export default AttachmentThumbnail;
