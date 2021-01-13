import {withTracker} from 'meteor/react-meteor-data';

import React from 'react';
import PropTypes from 'prop-types';

import Currency from 'currency-formatter';
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

import {onlyASCII} from '../../api/string.js';
import {usePatient} from '../../api/patients.js';

import {settings} from '../../client/settings.js';

import withLazyOpening from '../modal/withLazyOpening.js';
import SEPAPaymentQRCode from '../payment/SEPAPaymentQRCode.js';

const SIZE_CODE = 256;
const SIZE_PROGRESS = 128;
const THICKNESS_PROGRESS = 3.6;

const useStyles = makeStyles((theme) => ({
	rightIcon: {
		marginLeft: theme.spacing(1)
	},
	code: {},
	codeContainer: {
		position: 'relative',
		display: 'block',
		height: SIZE_CODE
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
		zIndex: 1
	},
	codeWrap: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'
	}
}));

const ConsultationPaymentDialog = (props) => {
	const classes = useStyles();

	const {open, onClose, consultation, accountHolder, iban} = props;

	const {currency, price, paid, datetime} = consultation;

	const owed = price - paid;

	const options = {fields: ConsultationPaymentDialog.projection};
	const deps = [
		consultation.patientId,
		JSON.stringify(ConsultationPaymentDialog.projection)
	];
	const {loading, found, fields: patient} = usePatient(
		{},
		consultation.patientId,
		options,
		deps
	);

	const _date = dateFormat(datetime, 'yyyy-MM-dd');
	const _lastname = onlyASCII(patient.lastname);
	const _firstname = onlyASCII(patient.firstname);
	const unstructuredReference = `${_date} ${_lastname} ${_firstname}`;

	const data = {
		name: accountHolder.slice(0, 70),
		iban,
		currency,
		amount: owed,
		unstructuredReference: unstructuredReference.slice(0, 140)
	};

	const codeProps = {
		className: classes.code,
		level: 'H',
		size: SIZE_CODE
	};

	const patientIdentifier = found
		? `${patient.firstname} ${patient.lastname}`
		: `#${consultation.patientId}`;

	const codeStyle = {
		transition: 'opacity 200ms ease-out',
		opacity: loading ? 0.4 : found ? 1 : 0.2
	};

	return (
		<Dialog
			open={open}
			component="form"
			aria-labelledby="consultation-debt-settling-dialog-title"
			onClose={onClose}
		>
			{loading && <LinearProgress />}
			<DialogTitle id="consultation-debt-settling-dialog-title">
				Payment of consultation for patient {patientIdentifier}
			</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Before payment, the patient had paid{' '}
					<b>{Currency.format(paid, {code: currency})}</b> out of{' '}
					<b>{Currency.format(price, {code: currency})}</b>. The patient thus{' '}
					<b>owes {Currency.format(owed, {code: currency})}</b> for this
					consultation. This is the amount that is programmed for this payment.
				</DialogContentText>
				<div className={classes.codeContainer}>
					<div className={classes.codeProgress}>
						{loading ? (
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
				<Button type="submit" color="primary" onClick={onClose}>
					Close
					<CloseIcon className={classes.rightIcon} />
				</Button>
			</DialogActions>
		</Dialog>
	);
};

ConsultationPaymentDialog.projection = {
	firstname: 1,
	lastname: 1
};

ConsultationPaymentDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired
};

export default withLazyOpening(
	withTracker(() => {
		settings.subscribe('account-holder');
		settings.subscribe('iban');

		const accountHolder = settings.get('account-holder');
		const iban = settings.get('iban');

		return {
			accountHolder,
			iban
		};
	})(ConsultationPaymentDialog)
);
