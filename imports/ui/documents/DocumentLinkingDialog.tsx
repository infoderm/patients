import React, {useState} from 'react';

import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import LoadingButton from '@mui/lab/LoadingButton';
import LinkIcon from '@mui/icons-material/Link';

import DialogWithVisibleOverflow from '../modal/DialogWithVisibleOverflow';

import withLazyOpening from '../modal/withLazyOpening';
import useIsMounted from '../hooks/useIsMounted';
import PatientPicker from '../patients/PatientPicker';
import link from '../../api/endpoint/documents/link';
import CancelButton from '../button/CancelButton';
import useCall from '../action/useCall';

type Props = {
	open: boolean;
	onClose: () => void;
	document: {_id: string};
	existingLink?: {_id: string};
};

const DocumentLinkingDialog = ({
	open,
	onClose,
	document,
	existingLink = undefined,
}: Props) => {
	const [patients, setPatients] = useState(existingLink ? [existingLink] : []);
	const [call, {pending}] = useCall();

	const isMounted = useIsMounted();

	const linkThisDocument = async (event) => {
		event.preventDefault();
		const documentId = document._id;
		const patientId = patients[0]!._id;
		try {
			await call(link, documentId, patientId);
			console.log(`Document #${documentId} linked to patient #${patientId}.`);
			if (isMounted()) onClose();
		} catch (error: unknown) {
			console.error(error);
		}
	};

	return (
		<DialogWithVisibleOverflow open={open} onClose={onClose}>
			<DialogTitle>Link document {document._id.toString()}</DialogTitle>
			<DialogContent>
				<DialogContentText>
					If you do not want to link this document, click cancel. If you really
					want to link this document, enter the name of the patient to link it
					to and click the link button.
				</DialogContentText>
				<PatientPicker
					TextFieldProps={{
						autoFocus: true,
						label: 'Patient to link document to',
						margin: 'normal',
					}}
					readOnly={pending}
					value={patients}
					onChange={(e) => {
						setPatients(e.target.value);
					}}
				/>
			</DialogContent>
			<DialogActions>
				<CancelButton onClick={onClose} />
				<LoadingButton
					disabled={patients.length === 0}
					loading={pending}
					color="secondary"
					endIcon={<LinkIcon />}
					loadingPosition="end"
					onClick={linkThisDocument}
				>
					Link
				</LoadingButton>
			</DialogActions>
		</DialogWithVisibleOverflow>
	);
};

DocumentLinkingDialog.projection = {
	_id: 1,
};

export default withLazyOpening(DocumentLinkingDialog);
