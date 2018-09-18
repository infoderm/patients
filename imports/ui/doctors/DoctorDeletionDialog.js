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

const styles = theme => ({
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
}) ;

class DoctorDeletionDialog extends React.Component {

  constructor ( props ) {
    super( props ) ;
    this.state = {
      name: '',
      nameError: '',
    };
  }

  render () {

    const { open , onClose , doctor, classes } = this.props ;
    const { name , nameError } = this.state ;

    const deleteThisDoctorIfNameMatches = event => {
      event.preventDefault();
      if ( name.toLowerCase() === doctor.name.toLowerCase() ) {
	this.setState({nameError: ''});
	Meteor.call('doctors.delete', doctor._id, (err, res) => {
	  if ( err ) console.error( err ) ;
	  else {
	    console.log(`Doctor #${doctor._id} deleted.`)
	    onClose();
	  }
	});
      }
      else {
	this.setState({nameError: 'Names do not match'});
      }
    };

    return (
	<Dialog
	  open={open}
	  onClose={onClose}
	  component="form"
	  aria-labelledby="patient-deletion-dialog-title"
	>
	  <DialogTitle id="patient-deletion-dialog-title">Delete doctor {doctor.name}</DialogTitle>
	  <DialogContent>
	    <DialogContentText>
	      If you do not want to delete this doctor, click cancel.
	      If you really want to delete this doctor from the system, enter
	      the doctor's name below and click the delete button.
	    </DialogContentText>
	    <TextField
	      autoFocus
	      margin="dense"
	      label="Doctor's name"
	      fullWidth
	      value={name}
	      onChange={e => this.setState({name: e.target.value})}
	      helperText={nameError}
	      error={!!nameError}
	    />
	  </DialogContent>
	  <DialogActions>
	    <Button type="submit" onClick={onClose} color="default">
	      Cancel
	      <CancelIcon className={classes.rightIcon}/>
	    </Button>
	    <Button onClick={deleteThisDoctorIfNameMatches} color="secondary">
	      Delete
	      <DeleteIcon className={classes.rightIcon}/>
	    </Button>
	  </DialogActions>
	</Dialog>
    );
  }

}

DoctorDeletionDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  doctor: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
} ;

export default withStyles(styles)(DoctorDeletionDialog) ;
