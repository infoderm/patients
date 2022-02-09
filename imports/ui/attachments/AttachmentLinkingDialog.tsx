import React, {useState} from 'react';

import {styled} from '@mui/material/styles';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import LinkIcon from '@mui/icons-material/Link';

import call from '../../api/endpoint/call';
import patientsAttach from '../../api/endpoint/patients/attach';

import withLazyOpening from '../modal/withLazyOpening';
import useIsMounted from '../hooks/useIsMounted';
import PatientPicker from '../patients/PatientPicker';
import useUniqueId from '../hooks/useUniqueId';
import CancelButton from '../button/CancelButton';

const PREFIX = 'AttachmentLinkingDialog';

const classes = {
	dialogPaper: `${PREFIX}-dialogPaper`,
};

const StyledDialog = styled(Dialog)({
	[`& .${classes.dialogPaper}`]: {
		overflow: 'visible',
	},
});

interface Props {
	open: boolean;
	onClose: () => void;
	attachment: {_id: string};
	existingLink?: {_id: string};
}

const AttachmentLinkingDialog = ({
	open,
	onClose,
	attachment,
	existingLink,
}: Props) => {
	const [patient, setPatient] = useState(existingLink ? [existingLink] : []);

	const isMounted = useIsMounted();

	const linkThisAttachment = async (event) => {
		event.preventDefault();
		const attachmentId = attachment._id;
		const patientId = patient[0]._id;
		try {
			await call(patientsAttach, patientId, attachmentId);
			console.log(
				`Attachment #${attachmentId} linked to patient #${patientId}.`,
			);
			if (isMounted()) onClose();
		} catch (error: unknown) {
			console.error(error);
		}
	};

	const titleId = useUniqueId('attachment-linking-dialog-title');

	return (
		<StyledDialog
			classes={{paper: classes.dialogPaper}}
			open={open}
			aria-labelledby={titleId}
			onClose={onClose}
		>
			<DialogTitle id={titleId}>Link attachment {attachment._id}</DialogTitle>
			<DialogContent className={classes.dialogPaper}>
				<DialogContentText>
					If you do not want to link this attachment, click cancel. If you
					really want to link this attachment, enter the name of the patient to
					link it to and click the link button.
				</DialogContentText>
				<PatientPicker
					TextFieldProps={{
						autoFocus: true,
						label: 'Patient to link attachment to',
						margin: 'normal',
					}}
					value={patient}
					onChange={(e) => {
						setPatient(e.target.value);
					}}
				/>
			</DialogContent>
			<DialogActions>
				<CancelButton onClick={onClose} />
				<Button
					disabled={patient.length === 0}
					color="secondary"
					endIcon={<LinkIcon />}
					onClick={linkThisAttachment}
				>
					Link
				</Button>
			</DialogActions>
		</StyledDialog>
	);
};

AttachmentLinkingDialog.projection = {
	_id: 1,
};

export default withLazyOpening(AttachmentLinkingDialog);
