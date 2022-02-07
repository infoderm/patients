import React from 'react';

import dateFormat from 'date-fns/format';

import {makeStyles} from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import LinearProgress from '@material-ui/core/LinearProgress';
import CircularProgress from '@material-ui/core/CircularProgress';

import CloseIcon from '@material-ui/icons/Close';

import {ConsultationDocument} from '../../api/collection/consultations';

import {onlyASCII} from '../../api/string';

import {useCurrencyFormat} from '../../i18n/currency';

import {useSetting} from '../settings/hooks';

import usePatient from '../patients/usePatient';
import withLazyOpening from '../modal/withLazyOpening';
import SEPAPaymentQRCode from '../payment/SEPAPaymentQRCode';
import useUniqueId from '../hooks/useUniqueId';

const SIZE_CODE = 256;
const SIZE_PROGRESS = 128;
const THICKNESS_PROGRESS = 3.6;

const useStyles = makeStyles({
	code: {},
	codeContainer: {
		position: 'relative',
		display: 'block',
		height: SIZE_CODE,
	},
	codeProgress: {
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
	},
	codeWrap: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
});

interface Props {
	open: boolean;
	onClose: () => void;
	consultation: ConsultationDocument;
}

const ConsultationPaymentDialog = ({open, onClose, consultation}: Props) => {
	const classes = useStyles();

	const {loading: loadingAccountHolder, value: accountHolder} =
		useSetting('account-holder');
	const {loading: loadingIban, value: iban} = useSetting('iban');

	const {currency, price, paid, datetime} = consultation;

	const currencyFormat = useCurrencyFormat(currency);

	const owed = price - paid;

	const options = {fields: ConsultationPaymentDialog.projection};
	const deps = [
		consultation.patientId,
		JSON.stringify(ConsultationPaymentDialog.projection),
	];
	const {
		loading: loadingPatient,
		found,
		fields: patient,
	} = usePatient({}, consultation.patientId, options, deps);

	const loading = loadingAccountHolder || loadingIban || loadingPatient;

	const _date = dateFormat(datetime, 'yyyy-MM-dd');
	const _lastname = onlyASCII(patient.lastname);
	const _firstname = onlyASCII(patient.firstname);
	const unstructuredReference = `${_date} ${_lastname} ${_firstname}`;

	const data = {
		name: accountHolder.slice(0, 70),
		iban,
		currency,
		amount: owed,
		unstructuredReference: unstructuredReference.slice(0, 140),
	};

	const codeProps = {
		className: classes.code,
		level: 'H',
		size: SIZE_CODE,
	};

	const patientIdentifier = found
		? `${patient.firstname} ${patient.lastname}`
		: `#${consultation.patientId}`;

	const codeStyle = {
		transition: 'opacity 200ms ease-out',
		opacity: loading ? 0.4 : found ? 1 : 0.2,
	};

	const titleId = useUniqueId('consultation-debt-settling-dialog-title');

	return (
		<Dialog open={open} aria-labelledby={titleId} onClose={onClose}>
			{loading && <LinearProgress />}
			<DialogTitle id={titleId}>
				Payment of consultation for patient {patientIdentifier}
			</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Before payment, the patient had paid <b>{currencyFormat(paid)}</b> out
					of <b>{currencyFormat(price)}</b>. The patient thus{' '}
					<b>owes {currencyFormat(owed)}</b> for this consultation. This is the
					amount that is programmed for this payment.
				</DialogContentText>
				<div className={classes.codeContainer}>
					<div className={classes.codeProgress}>
						{loadingPatient ? (
							<CircularProgress
								disableShrink
								size={SIZE_PROGRESS}
								thickness={THICKNESS_PROGRESS}
							/>
						) : (
							!found && 'PATIENT NOT FOUND'
						)}
					</div>
					<div className={classes.codeWrap} style={codeStyle}>
						<SEPAPaymentQRCode data={data} codeProps={codeProps} />
					</div>
				</div>
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
};

export default withLazyOpening(ConsultationPaymentDialog);
