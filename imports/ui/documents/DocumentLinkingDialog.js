import {Meteor} from 'meteor/meteor';

import React, {useState} from 'react';
import PropTypes from 'prop-types';

import {makeStyles} from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import LinkIcon from '@material-ui/icons/Link';
import CancelIcon from '@material-ui/icons/Cancel';

import withLazyOpening from '../modal/withLazyOpening.js';
import PatientPicker from '../patients/PatientPicker.js';

const useStyles = makeStyles((theme) => ({
	rightIcon: {
		marginLeft: theme.spacing(1)
	},
	dialogPaper: {
		overflow: 'visible'
	}
}));

const DocumentLinkingDialog = ({open, onClose, document, existingLink}) => {
	const classes = useStyles();

	const [patients, setPatients] = useState(existingLink ? [existingLink] : []);

	const linkThisDocument = (event) => {
		event.preventDefault();
		const documentId = document._id;
		const patientId = patients[0]._id;
		Meteor.call('documents.link', documentId, patientId, (err, _res) => {
			if (err) {
				console.error(err);
			} else {
				console.log(`Document #${documentId} linked to patient #${patientId}.`);
				onClose();
			}
		});
	};

	return (
		<Dialog
			classes={{paper: classes.dialogPaper}}
			open={open}
			component="form"
			aria-labelledby="document-linking-dialog-title"
			onClose={onClose}
		>
			<DialogTitle id="document-linking-dialog-title">
				Link document {document._id.toString()}
			</DialogTitle>
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
						margin: 'normal'
					}}
					value={patients}
					onChange={(e) => setPatients(e.target.value)}
				/>
			</DialogContent>
			<DialogActions>
				<Button type="submit" color="default" onClick={onClose}>
					Cancel
					<CancelIcon className={classes.rightIcon} />
				</Button>
				<Button
					disabled={patients.length === 0}
					color="secondary"
					onClick={linkThisDocument}
				>
					Link
					<LinkIcon className={classes.rightIcon} />
				</Button>
			</DialogActions>
		</Dialog>
	);
};

DocumentLinkingDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	document: PropTypes.object,
	existingLink: PropTypes.object
};

DocumentLinkingDialog.projection = {
	_id: 1
};

export default withLazyOpening(DocumentLinkingDialog);
