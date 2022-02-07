import React, {useState} from 'react';

import {makeStyles} from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import LinkIcon from '@material-ui/icons/Link';

import withLazyOpening from '../modal/withLazyOpening';
import useIsMounted from '../hooks/useIsMounted';
import PatientPicker from '../patients/PatientPicker';
import call from '../../api/endpoint/call';
import link from '../../api/endpoint/documents/link';
import CancelButton from '../button/CancelButton';

const useStyles = makeStyles({
	dialogPaper: {
		overflow: 'visible',
	},
});

interface Props {
	open: boolean;
	onClose: () => void;
	document: {_id: string};
	existingLink: {_id: string};
}

const DocumentLinkingDialog = ({
	open,
	onClose,
	document,
	existingLink,
}: Props) => {
	const classes = useStyles();

	const [patients, setPatients] = useState(existingLink ? [existingLink] : []);

	const isMounted = useIsMounted();

	const linkThisDocument = async (event) => {
		event.preventDefault();
		const documentId = document._id;
		const patientId = patients[0]._id;
		try {
			await call(link, documentId, patientId);
			console.log(`Document #${documentId} linked to patient #${patientId}.`);
			if (isMounted()) onClose();
		} catch (error: unknown) {
			console.error(error);
		}
	};

	return (
		<Dialog
			classes={{paper: classes.dialogPaper}}
			open={open}
			onClose={onClose}
		>
			<DialogTitle>Link document {document._id.toString()}</DialogTitle>
			<DialogContent className={classes.dialogPaper}>
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
					value={patients}
					onChange={(e) => {
						setPatients(e.target.value);
					}}
				/>
			</DialogContent>
			<DialogActions>
				<CancelButton onClick={onClose} />
				<Button
					disabled={patients.length === 0}
					color="secondary"
					endIcon={<LinkIcon />}
					onClick={linkThisDocument}
				>
					Link
				</Button>
			</DialogActions>
		</Dialog>
	);
};

DocumentLinkingDialog.projection = {
	_id: 1,
};

export default withLazyOpening(DocumentLinkingDialog);
