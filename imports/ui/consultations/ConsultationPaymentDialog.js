import {withTracker} from 'meteor/react-meteor-data';

import React from 'react';
import PropTypes from 'prop-types';

import Currency from 'currency-formatter';
import dateFormat from 'date-fns/format';

import {makeStyles} from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Dialog from '../modal/OptimizedDialog.js';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import CloseIcon from '@material-ui/icons/Close';

import {onlyASCII} from '../../api/string.js';

import {settings} from '../../api/settings.js';

import SEPAPaymentQRCode from '../payment/SEPAPaymentQRCode.js';

const useStyles = makeStyles((theme) => ({
	rightIcon: {
		marginLeft: theme.spacing(1)
	},
	code: {
		display: 'block',
		margin: 'auto'
	}
}));

const ConsultationPaymentDialog = (props) => {
	const classes = useStyles();

	const {open, onClose, patient, consultation, accountHolder, iban} = props;

	const {currency, price, paid, datetime} = consultation;

	const owed = price - paid;

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
		size: 256
	};

	return (
		<Dialog
			open={open}
			component="form"
			aria-labelledby="consultation-debt-settling-dialog-title"
			onClose={onClose}
		>
			<DialogTitle id="consultation-debt-settling-dialog-title">
				Payment of consultation for patient {patient.firstname}{' '}
				{patient.lastname}
			</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Before payment, the patient had paid{' '}
					<b>{Currency.format(paid, {code: currency})}</b> out of{' '}
					<b>{Currency.format(price, {code: currency})}</b>. The patient thus{' '}
					<b>owes {Currency.format(owed, {code: currency})}</b> for this
					consultation. This is the amount that is programmed for this payment.
				</DialogContentText>
				<SEPAPaymentQRCode data={data} codeProps={codeProps} />
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
	onClose: PropTypes.func.isRequired,
	patient: PropTypes.object.isRequired
};

export default withTracker(() => {
	settings.subscribe('account-holder');
	settings.subscribe('iban');

	const accountHolder = settings.get('account-holder');
	const iban = settings.get('iban');

	return {
		accountHolder,
		iban
	};
})(ConsultationPaymentDialog);
