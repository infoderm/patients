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

const AttachmentLinkingDialog = ({open, onClose, attachment, existingLink}) => {
	const classes = useStyles();

	const [patient, setPatient] = useState(existingLink ? [existingLink] : []);

	const linkThisAttachment = (event) => {
		event.preventDefault();
		const attachmentId = attachment._id;
		const patientId = patient[0]._id;
		Meteor.call('patients.attach', patientId, attachmentId, (err, _res) => {
			if (err) {
				console.error(err);
			} else {
				console.log(
					`Attachment #${attachmentId} linked to patient #${patientId}.`
				);
				onClose();
			}
		});
	};

	return (
		<Dialog
			classes={{paper: classes.dialogPaper}}
			open={open}
			component="form"
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
						margin: 'normal'
					}}
					value={patient}
					onChange={(e) => setPatient(e.target.value)}
				/>
			</DialogContent>
			<DialogActions>
				<Button type="submit" color="default" onClick={onClose}>
					Cancel
					<CancelIcon className={classes.rightIcon} />
				</Button>
				<Button
					disabled={patient.length === 0}
					color="secondary"
					onClick={linkThisAttachment}
				>
					Link
					<LinkIcon className={classes.rightIcon} />
				</Button>
			</DialogActions>
		</Dialog>
	);
};

AttachmentLinkingDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	attachment: PropTypes.object,
	existingLink: PropTypes.object
};

AttachmentLinkingDialog.projection = {
	_id: 1
};

export default withLazyOpening(AttachmentLinkingDialog);
