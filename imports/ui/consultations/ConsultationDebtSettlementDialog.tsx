import React, {useCallback} from 'react';
import {useSnackbar} from 'notistack';

import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';

import {type ConsultationDocument} from '../../api/collection/consultations';
import update from '../../api/endpoint/consultations/update';

import {useCurrencyFormat} from '../../i18n/currency';

import usePatient from '../patients/usePatient';
import withLazyOpening from '../modal/withLazyOpening';
import ConfirmationDialog from '../modal/ConfirmationDialog';
import debounceSnackbar from '../../util/debounceSnackbar';
import useCall from '../action/useCall';

type Props = {
	open: boolean;
	onClose: () => void;
	consultation: ConsultationDocument;
};

const ConsultationDebtSettlementDialog = ({
	open,
	onClose,
	consultation,
}: Props) => {
	const {_id, patientId, currency, price, paid} = consultation;

	const owed = price - paid;

	const options = {fields: ConsultationDebtSettlementDialog.projection};
	const deps = [
		patientId,
		JSON.stringify(ConsultationDebtSettlementDialog.projection),
	];
	const {
		loading,
		found,
		fields: patient,
	} = usePatient({}, patientId, options, deps);

	const currencyFormat = useCurrencyFormat(currency);

	const {enqueueSnackbar, closeSnackbar} = useSnackbar();
	const [call, {pending}] = useCall();

	const clearDebtForThisConsultation = useCallback(
		async (event) => {
			event.preventDefault();

			const $set = {
				paid: price,
			};

			const feedback = debounceSnackbar({enqueueSnackbar, closeSnackbar});
			feedback('Processing...', {variant: 'info', persist: true});
			try {
				await call(update, _id, $set);
				const message = `Consultation #${_id} updated.`;
				console.log(message);
				feedback(message, {variant: 'success'});
				onClose();
			} catch (error: unknown) {
				console.error({error});
				const message =
					error instanceof Error ? error.message : 'unknown error';
				feedback(message, {variant: 'error'});
			}
		},
		[call, onClose, _id, price, enqueueSnackbar, closeSnackbar],
	);

	const patientIdentifier = found
		? `${patient.firstname} ${patient.lastname}`
		: `#${consultation.patientId}`;

	return (
		<ConfirmationDialog
			open={open}
			loading={loading}
			pending={pending}
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
