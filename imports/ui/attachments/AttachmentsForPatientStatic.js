import React from 'react';
import PropTypes from 'prop-types';

import {makeStyles} from '@material-ui/core/styles';

import Fab from '@material-ui/core/Fab';
import AttachFileIcon from '@material-ui/icons/AttachFile';

import NoContent from '../navigation/NoContent.js';
import Paginator from '../navigation/Paginator.js';

import AttachFileButton from '../attachments/AttachFileButton.js';
import AttachmentsGallery from '../attachments/AttachmentsGallery.js';

const useStyles = makeStyles((theme) => ({
	attachButton: {
		position: 'fixed',
		bottom: theme.spacing(3),
		right: theme.spacing(30)
	}
}));

export default function AttachmentsForPatientStatic({
	patientId,
	attachmentsInfo,
	page,
	perpage,
	...rest
}) {
	const classes = useStyles();

	const attachmentsInfoSlice = attachmentsInfo.slice(
		(page - 1) * perpage,
		page * perpage
	);

	return (
		<>
			{attachmentsInfoSlice.length === 0 && (
				<NoContent>Nothing to see on page {page}.</NoContent>
			)}
			<div {...rest}>
				<AttachmentsGallery attachmentsInfo={attachmentsInfoSlice} />
			</div>
			<AttachFileButton
				Button={Fab}
				className={classes.attachButton}
				color="default"
				method="patients.attach"
				item={patientId}
			>
				<AttachFileIcon />
			</AttachFileButton>
			<Paginator
				page={page}
				end={attachmentsInfoSlice.length < perpage}
				root={`/patient/${patientId}/attachments`}
			/>
		</>
	);
}

AttachmentsForPatientStatic.propTypes = {
	patientId: PropTypes.string.isRequired,
	attachmentsInfo: PropTypes.array.isRequired,
	page: PropTypes.number.isRequired
};
