import { Meteor } from 'meteor/meteor' ;
import { withTracker } from 'meteor/react-meteor-data' ;

import React from 'react';
import PropTypes from 'prop-types';

import Currency from 'currency-formatter' ;

import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import dateFormat from 'date-fns/format' ;

import { settings } from '../../api/settings.js';

import CloseIcon from '@material-ui/icons/Close';

import SEPAPaymentQRCode from '../payment/SEPAPaymentQRCode.js';

const styles = theme => ({
  rightIcon: {
    marginLeft: theme.spacing.unit,
  } ,
  code: {
    display: 'block',
    margin: 'auto',
  } ,
}) ;

function ConsultationPaymentDialog ( props ) {

  const { open , onClose , patient , consultation, classes,
    accountHolder,
    iban,
  } = props ;

    const { currency , price , paid, datetime } = consultation ;

    const owed = price - paid ;

    const unstructuredReference = dateFormat(datetime, 'YYYY-MM-DD') ;

    const data = {
      name: accountHolder,
      iban,
      currency,
      amount: owed,
      unstructuredReference,
    } ;

    const codeProps = {
	    className: classes.code,
	    level: 'H',
	    size: 256,
    } ;

    return (
	<Dialog
	  open={open}
	  onClose={onClose}
	  component="form"
	  aria-labelledby="consultation-debt-settling-dialog-title"
	>
	  <DialogTitle id="consultation-debt-settling-dialog-title">Payment of consultation for patient {patient.firstname} {patient.lastname}</DialogTitle>
	  <DialogContent>
	    <DialogContentText>
	      Before payment, the
	      patient had
	      paid <b>{Currency.format(paid, {code: currency})}</b> out
	      of <b>{Currency.format(price, {code: currency})}</b>. The patient
	      thus <b>owes {Currency.format(owed, {code: currency})}</b> for
	      this consultation. This is the amount that is programmed for this payment.
	    </DialogContentText>
	    <SEPAPaymentQRCode
	      data={data}
	      codeProps={codeProps}
	    />
	  </DialogContent>
	  <DialogActions>
	    <Button type="submit" onClick={onClose} color="primary">
	      Close
	      <CloseIcon className={classes.rightIcon}/>
	    </Button>
	  </DialogActions>
	</Dialog>
    );
}

ConsultationPaymentDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  patient: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
} ;

let Component = ConsultationPaymentDialog;

Component = withStyles( styles , { withTheme: true })(Component)

Component = withTracker(() => {

	settings.subscribe('account-holder');
	settings.subscribe('iban');

	const accountHolder = settings.get('account-holder');
	const iban = settings.get('iban');

	return {
		accountHolder,
		iban,
	} ;

})(Component) ;

export default Component ;
