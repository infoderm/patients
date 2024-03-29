import React, {useState} from 'react';

import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import LinkIcon from '@mui/icons-material/Link';
import LoadingButton from '@mui/lab/LoadingButton';

import DialogWithVisibleOverflow from '../modal/DialogWithVisibleOverflow';

import patientsAttach from '../../api/endpoint/patients/attach';

import withLazyOpening from '../modal/withLazyOpening';
import useIsMounted from '../hooks/useIsMounted';
import PatientPicker from '../patients/PatientPicker';
import CancelButton from '../button/CancelButton';
import useCall from '../action/useCall';

type Props = {
	readonly open: boolean;
	readonly onClose: () => void;
	readonly attachment: {_id: string};
	readonly existingLink?: {_id: string};
};

const AttachmentLinkingDialog = ({
	open,
	onClose,
	attachment,
	existingLink,
}: Props) => {
	const [patient, setPatient] = useState(existingLink ? [existingLink] : []);
	const [call, {pending}] = useCall();

	const isMounted = useIsMounted();

	const linkThisAttachment = async (event) => {
		event.preventDefault();
		const attachmentId = attachment._id;
		const patientId = patient[0]!._id;
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
		<DialogWithVisibleOverflow open={open} onClose={onClose}>
			<DialogTitle>Link attachment {attachment._id}</DialogTitle>
			<DialogContent>
				<DialogContentText>
					If you do not want to link this attachment, click cancel. If you
					really want to link this attachment, enter the name of the patient to
					link it to and click the link button.
				</DialogContentText>
				<PatientPicker
					readOnly={pending}
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
				<CancelButton disabled={pending} onClick={onClose} />
				<LoadingButton
					disabled={patient.length === 0}
					loading={pending}
					color="secondary"
					endIcon={<LinkIcon />}
					loadingPosition="end"
					onClick={linkThisAttachment}
				>
					Link
				</LoadingButton>
			</DialogActions>
		</DialogWithVisibleOverflow>
	);
};

AttachmentLinkingDialog.projection = {
	_id: 1,
};

export default withLazyOpening(AttachmentLinkingDialog);
