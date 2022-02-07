import React from 'react';
import PropTypes, {InferProps} from 'prop-types';

import Grid from '@mui/material/Grid';
import AttachmentCard from './AttachmentCard';

const AttachmentsGrid = ({
	attachments,
	attachmentsInfo,
	...rest
}: InferProps<typeof AttachmentsGrid.propTypes>) => (
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

AttachmentsGrid.propTypes = {
	attachments: PropTypes.array.isRequired,
	attachmentsInfo: PropTypes.instanceOf(Map),
};

export default AttachmentsGrid;
