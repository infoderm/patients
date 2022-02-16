import React from 'react';

import Grid from '@mui/material/Grid';
import PropsOf from '../../util/PropsOf';

import {AttachmentDocument} from '../../api/collection/attachments';
import AttachmentCard, {AttachmentInfo} from './AttachmentCard';

interface AttachmentsGridProps extends PropsOf<typeof Grid> {
	attachments: AttachmentDocument[];
	attachmentsInfo?: Map<string, AttachmentInfo>;
}

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
