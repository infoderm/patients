import {Meteor} from 'meteor/meteor';

import React, {useState} from 'react';
import PropTypes from 'prop-types';

import {makeStyles} from '@material-ui/core/styles';
import {useSnackbar} from 'notistack';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '../modal/OptimizedDialog.js';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import DeleteIcon from '@material-ui/icons/Delete';
import CancelIcon from '@material-ui/icons/Cancel';

import {normalized} from '../../api/string.js';

const useStyles = makeStyles((theme) => ({
	rightIcon: {
		marginLeft: theme.spacing(1)
	}
}));

export default function PatientDeletionDialog({open, onClose, patient}) {
	const classes = useStyles();
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();
	const [lastname, setLastname] = useState('');
	const [lastnameError, setLastnameError] = useState('');

	const deleteThisPatientIfLastNameMatches = (event) => {
		event.preventDefault();
		if (normalized(lastname) === normalized(patient.lastname || '')) {
			setLastnameError('');
			const key = enqueueSnackbar('Processing...', {
				variant: 'info',
				persist: true
			});
			Meteor.call('patients.remove', patient._id, (err, _res) => {
				closeSnackbar(key);
				if (err) {
					console.error(err);
					enqueueSnackbar(err.message, {variant: 'error'});
				} else {
					const message = `Patient #${patient._id} deleted.`;
					console.log(message);
					enqueueSnackbar(message, {variant: 'success'});
					onClose();
				}
			});
		} else {
			setLastnameError('Last names do not match');
		}
	};

	return (
		<Dialog
			open={open}
			component="form"
			aria-labelledby="patient-deletion-dialog-title"
			onClose={onClose}
		>
			<DialogTitle id="patient-deletion-dialog-title">
				Delete patient {patient.firstname} {patient.lastname}
			</DialogTitle>
			<DialogContent>
				<DialogContentText>
					If you do not want to delete this patient, click cancel. If you really
					want to delete this patient from the system, enter its last name below
					and click the delete button.
				</DialogContentText>
				<TextField
					autoFocus
					fullWidth
					margin="dense"
					label="Patient's last name"
					value={lastname}
					helperText={lastnameError}
					error={Boolean(lastnameError)}
					onChange={(e) => setLastname(e.target.value)}
				/>
			</DialogContent>
			<DialogActions>
				<Button type="submit" color="default" onClick={onClose}>
					Cancel
					<CancelIcon className={classes.rightIcon} />
				</Button>
				<Button color="secondary" onClick={deleteThisPatientIfLastNameMatches}>
					Delete
					<DeleteIcon className={classes.rightIcon} />
				</Button>
			</DialogActions>
		</Dialog>
	);
}

PatientDeletionDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	patient: PropTypes.object.isRequired
};
