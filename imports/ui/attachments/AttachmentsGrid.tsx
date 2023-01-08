import React from 'react';

import Grid from '@mui/material/Grid';
import type PropsOf from '../../util/PropsOf';

import {type AttachmentDocument} from '../../api/collection/attachments';
import AttachmentCard, {type AttachmentInfo} from './AttachmentCard';

type AttachmentsGridProps = {
	attachments: AttachmentDocument[];
	attachmentsInfo?: Map<string, AttachmentInfo>;
} & PropsOf<typeof Grid>;

const AttachmentsGrid = ({
	attachments,
	attachmentsInfo,
	...rest
}: AttachmentsGridProps) => (
	<Grid container {...rest}>
		{attachments.map((attachment) => (
			<Grid key={attachment._id} item sm={12} md={4} xl={3}>
				<AttachmentCard
					attachment={attachment}
					info={attachmentsInfo?.get(attachment._id)}
				/>
			</Grid>
		))}
	</Grid>
);

export default AttachmentsGrid;
