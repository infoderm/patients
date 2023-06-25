import assert from 'assert';

import React from 'react';

import dateFormat from 'date-fns/format';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';

import CloseIcon from '@mui/icons-material/Close';

import {styled} from '@mui/material/styles';

import {type ConsultationDocument} from '../../api/collection/consultations';

import {onlyASCII} from '../../api/string';

import {useCurrencyFormat} from '../../i18n/currency';

import {useSetting} from '../settings/hooks';

import usePatient from '../patients/usePatient';
import withLazyOpening from '../modal/withLazyOpening';
import SEPAPaymentQRCode from '../payment/SEPAPaymentQRCode';

const SIZE_CODE = 256;
const SIZE_PROGRESS = 128;
const THICKNESS_PROGRESS = 3.6;

const CodeContainer = styled('div')({
	position: 'relative',
	display: 'block',
	height: SIZE_CODE,
});

const CodeProgress = styled('div')({
	position: 'absolute',
	top: 0,
	bottom: 0,
	left: 0,
	right: 0,
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	fontSize: '2rem',
	zIndex: 1,
});

type CodeWrapAdditionalProps = {
	loading: boolean;
	found: boolean;
};

const codeWrapAdditionalProps = new Set<number | string | Symbol>([
	'loading',
	'found',
]);
const codeWrapShouldForwardProp = (prop) => !codeWrapAdditionalProps.has(prop);
const CodeWrap = styled('div', {
	shouldForwardProp: codeWrapShouldForwardProp,
})<CodeWrapAdditionalProps>(({loading, found}) => ({
	transition: 'opacity 200ms ease-out',
	opacity: loading ? 0.4 : found ? 1 : 0.2,
	position: 'absolute',
	top: 0,
	bottom: 0,
	left: 0,
	right: 0,
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
}));

const CodePadding = styled('div')({
	display: 'flex',
	padding: '1em',
	backgroundColor: '#fff',
});

type Props = {
	open: boolean;
	onClose: () => void;
	consultation: ConsultationDocument;
};

const ConsultationPaymentDialog = ({open, onClose, consultation}: Props) => {
	const {loading: loadingAccountHolder, value: accountHolder} =
		useSetting('account-holder');
	const {loading: loadingIban, value: iban} = useSetting('iban');

	const {currency, price, paid, datetime} = consultation;
	assert(currency !== undefined);
	assert(price !== undefined);
	assert(paid !== undefined);

	const currencyFormat = useCurrencyFormat(currency);

	const owed = price - paid;

	const query = {
		filter: {_id: consultation.patientId},
		projection: ConsultationPaymentDialog.projection,
	};
	const deps = [
		consultation.patientId,
		JSON.stringify(ConsultationPaymentDialog.projection),
	];
	const {
		loading: loadingPatient,
		found,
		fields: patient,
	} = usePatient({}, query, deps);

	const loading = loadingAccountHolder || loadingIban || loadingPatient;

	const _date = dateFormat(datetime, 'yyyy-MM-dd');
	const _lastname = onlyASCII(found ? patient.lastname ?? '' : '');
	const _firstname = onlyASCII(found ? patient.firstname ?? '' : '');
	const unstructuredReference = `${_date} ${_lastname} ${_firstname}`;

	const data = {
		name: accountHolder.slice(0, 70),
		iban,
		currency,
		amount: owed,
		unstructuredReference: unstructuredReference.slice(0, 140),
	};

	const codeProps = {
		level: 'H',
		size: SIZE_CODE,
	};

	const patientIdentifier = found
		? `${patient.firstname} ${patient.lastname}`
		: `#${consultation.patientId}`;

	return (
		<Dialog open={open} onClose={onClose}>
			{loading && <LinearProgress />}
			<DialogTitle>
				Payment of consultation for patient {patientIdentifier}
			</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Before payment, the patient had paid <b>{currencyFormat(paid)}</b> out
					of <b>{currencyFormat(price)}</b>. The patient thus{' '}
					<b>owes {currencyFormat(owed)}</b> for this consultation. This is the
					amount that is programmed for this payment.
				</DialogContentText>
				<br />
				<CodeContainer>
					<CodeProgress>
						{loadingPatient ? (
							<CircularProgress
								disableShrink
								size={SIZE_PROGRESS}
								thickness={THICKNESS_PROGRESS}
							/>
						) : (
							!found && 'PATIENT NOT FOUND'
						)}
					</CodeProgress>
					<CodeWrap loading={loading} found={found}>
						<CodePadding>
							<SEPAPaymentQRCode data={data} codeProps={codeProps} />
						</CodePadding>
					</CodeWrap>
				</CodeContainer>
			</DialogContent>
			<DialogActions>
				<Button color="primary" endIcon={<CloseIcon />} onClick={onClose}>
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
};

ConsultationPaymentDialog.projection = {
	firstname: 1,
	lastname: 1,
} as const;

export default withLazyOpening(ConsultationPaymentDialog);
