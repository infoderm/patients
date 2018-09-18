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

import EditIcon from '@material-ui/icons/Edit';
import CancelIcon from '@material-ui/icons/Cancel';

import MeteorSimpleAutoCompleteTextField from '../forms/MeteorSimpleAutoCompleteTextField.js';

import { Doctors } from '../../api/doctors.js';

const styles = theme => ({
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
}) ;

class DoctorRenamingDialog extends React.Component {

  constructor ( props ) {
    super( props ) ;
    this.state = {
      oldname: '',
      oldnameError: '',
      newname: '',
      newnameError: '',
    };
  }

  render () {

    const { open , onClose , doctor, classes } = this.props ;
    const { oldname , oldnameError , newname , newnameError } = this.state ;

    const renameThisDoctorIfNameMatchesAndNewNameNotEmpty = event => {
      event.preventDefault();
      let error = false;
      if ( oldname.toLowerCase() !== doctor.name.toLowerCase() ) {
	this.setState({oldnameError: 'Names do not match'});
	error = true;
      }
      else this.setState({oldnameError: ''});

      const name = newname.trim();
      if ( name.length === 0 ) {
	this.setState({newnameError: 'The new name is empty'});
	error = true;
      }
      else this.setState({newnameError: ''});

      if ( !error ) {
	Meteor.call('doctors.rename', doctor._id, name, (err, res) => {
	  if ( err ) console.error( err ) ;
	  else {
	    console.log(`Doctor #${doctor._id} rename from ${oldname} to ${name}.`)
	    onClose();
	  }
	});
      }

    };

    return (
	<Dialog
	  open={open}
	  onClose={onClose}
	  component="form"
	  aria-labelledby="patient-Renaming-dialog-title"
	>
	  <DialogTitle id="patient-Renaming-dialog-title">Rename doctor {doctor.name}</DialogTitle>
	  <DialogContent>
	    <DialogContentText>
	      If you do not want to rename this doctor, click cancel.
	      If you really want to rename this doctor from the system, enter
	      the doctor's old name and new name below and click the rename button.
	    </DialogContentText>
	    <TextField
	      autoFocus
	      margin="dense"
	      label="Doctor's old name"
	      fullWidth
	      value={oldname}
	      onChange={e => this.setState({oldname: e.target.value})}
	      helperText={oldnameError}
	      error={!!oldnameError}
	    />
	    <MeteorSimpleAutoCompleteTextField
	      subscription="doctors"
	      collection={Doctors}
	      selector={{name: { $ne: doctor.name}}}
	      stringify={doctor => doctor.name}
	      textFieldProps={{
		margin: "dense",
		label: "Doctor's new name",
		fullWidth: true,
		value: newname,
		onChange: e => this.setState({newname: e.target.value}),
		helperText: newnameError,
		error: !!newnameError,
	      }}
	    />
	  </DialogContent>
	  <DialogActions>
	    <Button type="submit" onClick={onClose} color="default">
	      Cancel
	      <CancelIcon className={classes.rightIcon}/>
	    </Button>
	    <Button onClick={renameThisDoctorIfNameMatchesAndNewNameNotEmpty} color="secondary">
	      Rename
	      <EditIcon className={classes.rightIcon}/>
	    </Button>
	  </DialogActions>
	</Dialog>
    );
  }

}

DoctorRenamingDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  doctor: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
} ;

export default withStyles(styles)(DoctorRenamingDialog) ;
