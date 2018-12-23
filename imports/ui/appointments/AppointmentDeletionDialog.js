import { Meteor } from 'meteor/meteor' ;

import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import DeleteIcon from '@material-ui/icons/Delete';
import CancelIcon from '@material-ui/icons/Cancel';

const styles = theme => ({
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
}) ;

class AppointmentDeletionDialog extends React.Component {

    deleteThisAppointment = event => {
      const {
	appointment,
	onClose,
      } = this.props ;
      event.preventDefault();
      Meteor.call('consultations.remove', appointment._id, (err, res) => {
	if ( err ) console.error( err ) ;
	else {
	  console.log(`Appointment #${appointment._id} deleted.`)
	  onClose();
	}
      });
    };


  render () {

    const {
      open ,
      onClose ,
      patient ,
      appointment,
      classes ,
    } = this.props ;

    return (
	<Dialog
	  open={open}
	  onClose={onClose}
	  component="form"
	  aria-labelledby="appointment-deletion-dialog-title"
	>
	  <DialogTitle id="appointment-deletion-dialog-title">Delete this appointment</DialogTitle>
	  <DialogContent>
	    <DialogContentText>
	      If you do not want to delete this appointment, click cancel.
	      If you really want to delete this appointment from the system, click delete.
	    </DialogContentText>
	  </DialogContent>
	  <DialogActions>
	    <Button type="submit" onClick={onClose} color="default">
	      Cancel
	      <CancelIcon className={classes.rightIcon}/>
	    </Button>
	    <Button onClick={this.deleteThisAppointment} color="secondary">
	      Delete
	      <DeleteIcon className={classes.rightIcon}/>
	    </Button>
	  </DialogActions>
	</Dialog>
    );
  }

}

AppointmentDeletionDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  appointment: PropTypes.object.isRequired,
} ;

export default withStyles(styles)(AppointmentDeletionDialog) ;
