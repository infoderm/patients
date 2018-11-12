import { Meteor } from 'meteor/meteor' ;

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

import CheckIcon from '@material-ui/icons/Check';
import CancelIcon from '@material-ui/icons/Cancel';

const styles = theme => ({
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
}) ;

class ConsultationDeletionDialog extends React.Component {

    clearDebtForThisConsultation = (onClose, consultation) => event => {
      event.preventDefault();

      const fields = {
	...consultation ,
	paid: consultation.price ,
      } ;

      Meteor.call('consultations.update', consultation._id, fields, (err, res) => {
	if ( err ) console.error(err) ;
	else {
	  console.log(`Consultation #${consultation._id} updated.`)
	  onClose();
	}
      });

    };


  render () {

    const { open , onClose , patient , consultation, classes } = this.props ;

    const { currency , price , paid } = consultation ;

    const owed = price - paid ;

    return (
	<Dialog
	  open={open}
	  onClose={onClose}
	  component="form"
	  aria-labelledby="consultation-debt-settling-dialog-title"
	>
	  <DialogTitle id="consultation-debt-settling-dialog-title">Clear debt of consultation for patient {patient.firstname} {patient.lastname}</DialogTitle>
	  <DialogContent>
	    <DialogContentText>
	      Before settlement, the
	      patient had
	      paid <b>{Currency.format(paid, {code: currency})}</b> out
	      of <b>{Currency.format(price, {code: currency})}</b>. The patient
	      thus <b>owed {Currency.format(owed, {code: currency})}</b> for
	      this consultation. <b>Once settled, the patient will
	      owe {Currency.format(0, {code: currency})} for
	      this consultation.</b> If
	      you do not want to settle debt for this consultation, click cancel.
	      If you really want to settle debt for this consultation, click clear debt.
	    </DialogContentText>
	  </DialogContent>
	  <DialogActions>
	    <Button type="submit" onClick={onClose} color="default">
	      Cancel
	      <CancelIcon className={classes.rightIcon}/>
	    </Button>
	    <Button onClick={this.clearDebtForThisConsultation(onClose, consultation)} color="primary">
	      Clear debt ({Currency.format(owed, {code: currency})})
	      <CheckIcon className={classes.rightIcon}/>
	    </Button>
	  </DialogActions>
	</Dialog>
    );
  }

}

ConsultationDeletionDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  patient: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
} ;

export default withStyles(styles)(ConsultationDeletionDialog) ;
