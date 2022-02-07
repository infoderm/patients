import React, {useMemo} from 'react';
import {useSnackbar} from 'notistack';

import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';

import {ConsultationDocument} from '../../api/collection/consultations';
import call from '../../api/endpoint/call';
import update from '../../api/endpoint/consultations/update';

import {useCurrencyFormat} from '../../i18n/currency';

import usePatient from '../patients/usePatient';
import withLazyOpening from '../modal/withLazyOpening';
import ConfirmationDialog from '../modal/ConfirmationDialog';

interface Props {
	open: boolean;
	onClose: () => void;
	consultation: ConsultationDocument;
}

const ConsultationDebtSettlementDialog = ({
	open,
	onClose,
	consultation,
}: Props) => {
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

	const clearDebtForThisConsultation = useMemo(() => {
		return async (event) => {
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
	}, [onClose, consultation, enqueueSnackbar, closeSnackbar]);

	const patientIdentifier = found
		? `${patient.firstname} ${patient.lastname}`
		: `#${consultation.patientId}`;

	return (
		<ConfirmationDialog
			open={open}
			loading={loading}
			title={`Clear debt of consultation for patient ${patientIdentifier}`}
			text={
				<>
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
				</>
			}
			cancel="Cancel"
			CancelIcon={CancelIcon}
			confirm={`Clear debt (${currencyFormat(owed)})`}
			ConfirmIcon={CheckIcon}
			confirmColor="primary"
			onCancel={onClose}
			onConfirm={clearDebtForThisConsultation}
		/>
	);
};

ConsultationDebtSettlementDialog.projection = {
	firstname: 1,
	lastname: 1,
};

export default withLazyOpening(ConsultationDebtSettlementDialog);
