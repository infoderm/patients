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
import LinearProgress from '@material-ui/core/LinearProgress';

import DeleteIcon from '@material-ui/icons/Delete';
import CancelIcon from '@material-ui/icons/Cancel';

import {normalized} from '../../api/string';
import usePatient from '../patients/usePatient';
import withLazyOpening from '../modal/withLazyOpening';
import useIsMounted from '../hooks/useIsMounted';

import ConfirmationTextField, {
	useConfirmationTextFieldState,
} from '../input/ConfirmationTextField';

const useStyles = makeStyles((theme) => ({
	rightIcon: {
		marginLeft: theme.spacing(1),
	},
}));

const ConsultationDeletionDialog = (props) => {
	const {open, onClose, consultation} = props;

	const options = {fields: ConsultationDeletionDialog.projection};
	const deps = [
		consultation.patientId,
		JSON.stringify(ConsultationDeletionDialog.projection),
	];
	const {
		loading,
		found,
		fields: patient,
	} = usePatient({}, consultation.patientId, options, deps);

	const classes = useStyles();
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();
	const getError = (expected, value) =>
		normalized(expected) === normalized(value) ? '' : 'Last names do not match';

	const {validate, props: ConfirmationTextFieldProps} =
		useConfirmationTextFieldState(patient.lastname, getError);

	const isMounted = useIsMounted();

	const deleteThisConsultationIfPatientsLastNameMatches = (event) => {
		event.preventDefault();
		if (validate()) {
			const key = enqueueSnackbar('Processing...', {variant: 'info'});
			Meteor.call('consultations.remove', consultation._id, (err, _res) => {
				closeSnackbar(key);
				if (err) {
					console.error(err);
					enqueueSnackbar(err.message, {variant: 'error'});
				} else {
					const message = `Consultation #${consultation._id} deleted.`;
					console.log(message);
					enqueueSnackbar(message, {variant: 'success'});
					if (isMounted()) onClose();
				}
			});
		}
	};

	const patientIdentifier = found
		? `${patient.firstname} ${patient.lastname}`
		: `#${consultation.patientId}`;
	const label = loading
		? 'Loading patient data...'
		: found
		? "Patient's last name"
		: 'Could not find patient.';
	return (
		<Dialog
			open={open}
			// component="form"
			aria-labelledby="consultation-deletion-dialog-title"
			onClose={onClose}
		>
			{loading && <LinearProgress />}
			<DialogTitle id="consultation-deletion-dialog-title">
				Delete consultation for patient {patientIdentifier}
			</DialogTitle>
			<DialogContent>
				<DialogContentText>
					If you do not want to delete this consultation, click cancel. If you
					really want to delete this consultation from the system, enter the
					patient&apos;s last name below and click the delete button.
				</DialogContentText>
				<ConfirmationTextField
					autoFocus
					fullWidth
					disabled={!found}
					margin="dense"
					label={label}
					{...ConfirmationTextFieldProps}
				/>
			</DialogContent>
			<DialogActions>
				<Button type="submit" color="default" onClick={onClose}>
					Cancel
					<CancelIcon className={classes.rightIcon} />
				</Button>
				<Button
					disabled={!found || ConfirmationTextFieldProps.error}
					color="secondary"
					onClick={deleteThisConsultationIfPatientsLastNameMatches}
				>
					Delete
					<DeleteIcon className={classes.rightIcon} />
				</Button>
			</DialogActions>
		</Dialog>
	);
};

ConsultationDeletionDialog.projection = {
	firstname: 1,
	lastname: 1,
};

ConsultationDeletionDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	consultation: PropTypes.object.isRequired,
};

export default withLazyOpening(ConsultationDeletionDialog);
