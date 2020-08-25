import {Meteor} from 'meteor/meteor';

import React from 'react';
import PropTypes from 'prop-types';

import Currency from 'currency-formatter';

import {makeStyles} from '@material-ui/core/styles';
import {useSnackbar} from 'notistack';

import Button from '@material-ui/core/Button';
import Dialog from '../modal/OptimizedDialog.js';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import LinearProgress from '@material-ui/core/LinearProgress';

import CheckIcon from '@material-ui/icons/Check';
import CancelIcon from '@material-ui/icons/Cancel';

import {usePatient} from '../../api/patients.js';

const useStyles = makeStyles((theme) => ({
	rightIcon: {
		marginLeft: theme.spacing(1)
	}
}));

export default function ConsultationDebtSettlementDialog(props) {
	const {open, onClose, consultation} = props;

	const {currency, price, paid} = consultation;

	const owed = price - paid;

	const options = {fields: ConsultationDebtSettlementDialog.projection};
	const deps = [
		consultation.patientId,
		JSON.stringify(ConsultationDebtSettlementDialog.projection)
	];
	const {loading, found, fields: patient} = usePatient(
		{},
		consultation.patientId,
		options,
		deps
	);

	const classes = useStyles();
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();

	const clearDebtForThisConsultation = (onClose, consultation) => (event) => {
		event.preventDefault();

		const fields = {
			...consultation,
			paid: consultation.price
		};

		const key = enqueueSnackbar('Processing...', {variant: 'info'});
		Meteor.call(
			'consultations.update',
			consultation._id,
			fields,
			(err, _res) => {
				closeSnackbar(key);
				if (err) {
					console.error(err);
					enqueueSnackbar(err.message, {variant: 'error'});
				} else {
					const message = `Consultation #${consultation._id} updated.`;
					console.log(message);
					enqueueSnackbar(message, {variant: 'success'});
					onClose();
				}
			}
		);
	};

	const patientIdentifier = found
		? `${patient.firstname} ${patient.lastname}`
		: `#${consultation.patientId}`;

	return (
		<Dialog
			open={open}
			component="form"
			aria-labelledby="consultation-debt-settling-dialog-title"
			onClose={onClose}
		>
			{loading && <LinearProgress />}
			<DialogTitle id="consultation-debt-settling-dialog-title">
				Clear debt of consultation for patient {patientIdentifier}
			</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Before settlement, the patient had paid{' '}
					<b>{Currency.format(paid, {code: currency})}</b> out of{' '}
					<b>{Currency.format(price, {code: currency})}</b>. The patient thus{' '}
					<b>owed {Currency.format(owed, {code: currency})}</b> for this
					consultation.{' '}
					<b>
						Once settled, the patient will owe{' '}
						{Currency.format(0, {code: currency})} for this consultation.
					</b>{' '}
					If you do not want to settle debt for this consultation, click cancel.
					If you really want to settle debt for this consultation, click clear
					debt.
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button type="submit" color="default" onClick={onClose}>
					Cancel
					<CancelIcon className={classes.rightIcon} />
				</Button>
				<Button
					color="primary"
					onClick={clearDebtForThisConsultation(onClose, consultation)}
				>
					Clear debt ({Currency.format(owed, {code: currency})})
					<CheckIcon className={classes.rightIcon} />
				</Button>
			</DialogActions>
		</Dialog>
	);
}

ConsultationDebtSettlementDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired
};

ConsultationDebtSettlementDialog.projection = {
	firstname: 1,
	lastname: 1
};
