import { Meteor } from 'meteor/meteor' ;

import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import DeleteIcon from '@material-ui/icons/Delete';
import CancelIcon from '@material-ui/icons/Cancel';

import { normalized } from '../../api/string.js';

const styles = theme => ({
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
}) ;

class ConsultationDeletionDialog extends React.Component {

  constructor ( props ) {
    super( props ) ;
    this.state = {
      lastname: '',
      lastnameError: '',
    };
  }

  render () {

    const { open , onClose , patient , consultation, classes } = this.props ;
    const { lastname , lastnameError } = this.state ;

    const deleteThisConsultationIfPatientsLastNameMatches = event => {
      event.preventDefault();
      if ( normalized(lastname) === normalized(patient.lastname) ) {
	this.setState({lastnameError: ''});
	Meteor.call('consultations.remove', consultation._id, (err, res) => {
	  if ( err ) console.error( err ) ;
	  else {
	    console.log(`Consultation #${consultation._id} deleted.`)
	    onClose();
	  }
	});
      }
      else {
	this.setState({lastnameError: 'Last names do not match'});
      }
    };

    return (
	<Dialog
	  open={open}
	  onClose={onClose}
	  component="form"
	  aria-labelledby="consultation-deletion-dialog-title"
	>
	  <DialogTitle id="consultation-deletion-dialog-title">Delete consultation for patient {patient.firstname} {patient.lastname}</DialogTitle>
	  <DialogContent>
	    <DialogContentText>
	      If you do not want to delete this consultation, click cancel.
	      If you really want to delete this consultation from the system, enter
	      the patient's last name below and click the delete button.
	    </DialogContentText>
	    <TextField
	      autoFocus
	      margin="dense"
	      label="Patient's last name"
	      fullWidth
	      value={lastname}
	      onChange={e => this.setState({lastname: e.target.value})}
	      helperText={lastnameError}
	      error={!!lastnameError}
	    />
	  </DialogContent>
	  <DialogActions>
	    <Button type="submit" onClick={onClose} color="default">
	      Cancel
	      <CancelIcon className={classes.rightIcon}/>
	    </Button>
	    <Button onClick={deleteThisConsultationIfPatientsLastNameMatches} color="secondary">
	      Delete
	      <DeleteIcon className={classes.rightIcon}/>
	    </Button>
	  </DialogActions>
	</Dialog>
    );
  }

}

ConsultationDeletionDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  consultation: PropTypes.object.isRequired,
  patient: PropTypes.object.isRequired,
} ;

export default withStyles(styles)(ConsultationDeletionDialog) ;
