import React from 'react';

import Grid from '@material-ui/core/Grid';
import AttachmentCard from './AttachmentCard.js';

const AttachmentsGrid = ({attachments, attachmentsInfo, ...rest}) => (
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
