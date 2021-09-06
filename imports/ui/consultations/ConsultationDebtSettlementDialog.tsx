import React from 'react';
import PropTypes from 'prop-types';
import {useSnackbar} from 'notistack';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import LinearProgress from '@material-ui/core/LinearProgress';

import CheckIcon from '@material-ui/icons/Check';
import CancelIcon from '@material-ui/icons/Cancel';

import {useCurrencyFormat} from '../../i18n/currency';

import usePatient from '../patients/usePatient';
import withLazyOpening from '../modal/withLazyOpening';
import call from '../../api/endpoint/call';
import update from '../../api/endpoint/consultations/update';

const ConsultationDebtSettlementDialog = (props) => {
	const {open, onClose, consultation} = props;

	const {currency, price, paid} = consultation;

	const owed = price - paid;

	const options = {fields: ConsultationDebtSettlementDialog.projection};
	const deps = [
		consultation.patientId,
		JSON.stringify(ConsultationDebtSettlementDialog.projection),
	];
	const {
		loading,
		found,
		fields: patient,
	} = usePatient({}, consultation.patientId, options, deps);

	const currencyFormat = useCurrencyFormat(currency);

	const {enqueueSnackbar, closeSnackbar} = useSnackbar();

	const clearDebtForThisConsultation =
		(onClose, consultation) => async (event) => {
			event.preventDefault();

			const fields = {
				...consultation,
				paid: consultation.price,
			};

			const key = enqueueSnackbar('Processing...', {variant: 'info'});
			try {
				await call(update, consultation._id, fields);
				closeSnackbar(key);
				const message = `Consultation #${consultation._id} updated.`;
				console.log(message);
				enqueueSnackbar(message, {variant: 'success'});
				onClose();
			} catch (error: unknown) {
				closeSnackbar(key);
				console.error({error});
				const message =
					error instanceof Error ? error.message : 'unknown error';
				enqueueSnackbar(message, {variant: 'error'});
			}
		};

	const patientIdentifier = found
		? `${patient.firstname} ${patient.lastname}`
		: `#${consultation.patientId}`;

	return (
		<Dialog
			open={open}
			// component="form"
			aria-labelledby="consultation-debt-settling-dialog-title"
			onClose={onClose}
		>
			{loading && <LinearProgress />}
			<DialogTitle id="consultation-debt-settling-dialog-title">
				Clear debt of consultation for patient {patientIdentifier}
			</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Before settlement, the patient had paid <b>{currencyFormat(paid)}</b>{' '}
					out of <b>{currencyFormat(price)}</b>. The patient thus{' '}
					<b>owed {currencyFormat(owed)}</b> for this consultation.{' '}
					<b>
						Once settled, the patient will owe {currencyFormat(0)} for this
						consultation.
					</b>{' '}
					If you do not want to settle debt for this consultation, click cancel.
					If you really want to settle debt for this consultation, click clear
					debt.
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button
					type="submit"
					color="default"
					endIcon={<CancelIcon />}
					onClick={onClose}
				>
					Cancel
				</Button>
				<Button
					color="primary"
					endIcon={<CheckIcon />}
					onClick={clearDebtForThisConsultation(onClose, consultation)}
				>
					Clear debt ({currencyFormat(owed)})
				</Button>
			</DialogActions>
		</Dialog>
	);
};

ConsultationDebtSettlementDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
};

ConsultationDebtSettlementDialog.projection = {
	firstname: 1,
	lastname: 1,
};

export default withLazyOpening(ConsultationDebtSettlementDialog);
