import React, {useState} from 'react';

import {makeStyles} from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import LinkIcon from '@material-ui/icons/Link';
import CancelIcon from '@material-ui/icons/Cancel';

import call from '../../api/endpoint/call';
import patientsAttach from '../../api/endpoint/patients/attach';

import withLazyOpening from '../modal/withLazyOpening';
import useIsMounted from '../hooks/useIsMounted';
import PatientPicker from '../patients/PatientPicker';

const useStyles = makeStyles({
	dialogPaper: {
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
	const classes = useStyles();

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

	return (
		<Dialog
			classes={{paper: classes.dialogPaper}}
			open={open}
			aria-labelledby="attachment-linking-dialog-title"
			onClose={onClose}
		>
			<DialogTitle id="attachment-linking-dialog-title">
				Link attachment {attachment._id}
			</DialogTitle>
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
				<Button color="default" endIcon={<CancelIcon />} onClick={onClose}>
					Cancel
				</Button>
				<Button
					disabled={patient.length === 0}
					color="secondary"
					endIcon={<LinkIcon />}
					onClick={linkThisAttachment}
				>
					Link
				</Button>
			</DialogActions>
		</Dialog>
	);
};

AttachmentLinkingDialog.projection = {
	_id: 1,
};

export default withLazyOpening(AttachmentLinkingDialog);
