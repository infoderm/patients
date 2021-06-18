import {Meteor} from 'meteor/meteor';

import React from 'react';
import PropTypes from 'prop-types';

import {makeStyles} from '@material-ui/core/styles';
import {useSnackbar} from 'notistack';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import DeleteIcon from '@material-ui/icons/Delete';
import CancelIcon from '@material-ui/icons/Cancel';

import {normalized} from '../../api/string';
import withLazyOpening from '../modal/withLazyOpening';
import useIsMounted from '../hooks/useIsMounted';

import ConfirmationTextField, {
	useConfirmationTextFieldState
} from '../input/ConfirmationTextField';
import StaticPatientCard from './StaticPatientCard';

const useStyles = makeStyles((theme) => ({
	rightIcon: {
		marginLeft: theme.spacing(1)
	}
}));

const PatientDeletionDialog = ({open, onClose, patient}) => {
	const classes = useStyles();
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();
	const getError = (expected, value) =>
		normalized(expected) === normalized(value) ? '' : 'Last names do not match';

	const {validate, props: ConfirmationTextFieldProps} =
		useConfirmationTextFieldState(patient.lastname || '', getError);

	const isMounted = useIsMounted();

	const deleteThisPatientIfLastNameMatches = (event) => {
		event.preventDefault();
		if (validate()) {
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
					if (isMounted()) onClose();
				}
			});
		}
	};

	return (
		<Dialog
			open={open}
			// component="form"
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
				<StaticPatientCard patient={patient} />
				<ConfirmationTextField
					autoFocus
					fullWidth
					margin="dense"
					label="Patient's last name"
					{...ConfirmationTextFieldProps}
				/>
			</DialogContent>
			<DialogActions>
				<Button type="submit" color="default" onClick={onClose}>
					Cancel
					<CancelIcon className={classes.rightIcon} />
				</Button>
				<Button
					disabled={ConfirmationTextFieldProps.error}
					color="secondary"
					onClick={deleteThisPatientIfLastNameMatches}
				>
					Delete
					<DeleteIcon className={classes.rightIcon} />
				</Button>
			</DialogActions>
		</Dialog>
	);
};

PatientDeletionDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	patient: PropTypes.object.isRequired
};

export default withLazyOpening(PatientDeletionDialog);
