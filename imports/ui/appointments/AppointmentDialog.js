import { Meteor } from 'meteor/meteor' ;
import { withTracker } from 'meteor/react-meteor-data' ;

import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import AccessTimeIcon from '@material-ui/icons/AccessTime';
import CancelIcon from '@material-ui/icons/Cancel';

import dateFormat from 'date-fns/format';

import { msToString } from '../../client/duration.js' ;

import { Patients , patients } from '../../api/patients.js';
import { settings } from '../../api/settings.js';
import { appointments } from '../../api/appointments.js';

import SetPicker from '../input/SetPicker.js';

const styles = theme => ({
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  dialogPaper: {
    overflow: 'visible',
  },
  multiline: {
    overflow: 'auto',
    width: '100%',
  },
}) ;

class AppointmentDialog extends React.Component {

  constructor ( props ) {
    super( props ) ;
    this.state = {
      date: dateFormat(props.initialDatetime, 'YYYY-MM-DD'),
      time: dateFormat(props.initialDatetime, 'HH:mm'),
      duration: props.appointmentDuration.length > 0 ? props.appointmentDuration[0] : 0,
      patient: props.initialPatient ? [ props.initialPatient ] : [ ],
      phone: '',
      reason: '',
      patientError: '',
      patientIsReadOnly: !!props.initialPatient,
    };
  }

  componentWillReceiveProps ( props ) {

    const fields = {
      date: dateFormat(props.initialDatetime, 'YYYY-MM-DD'),
      time: dateFormat(props.initialDatetime, 'HH:mm'),
    } ;

    if ( props.initialPatient ) {
      fields.patient = [ props.initialPatient ] ;
      fields.patientError = '' ;
      fields.patientIsReadOnly = true;
    }

    if (!props.appointmentDuration.includes(this.state.duration)) {
      fields.duration = props.appointmentDuration.length > 0 ? props.appointmentDuration[0] : 0 ;
    }

    this.setState( fields ) ;

  }

  createAppointment = event => {

    event.preventDefault();

    const {
      onClose,
      onSubmit,
    } = this.props;

    const {
      date ,
      time ,
      duration ,
      patient ,
      phone ,
      reason ,
    } = this.state ;

    if ( patient.length === 1 ) {
      this.setState({patientError: ''});
      const datetime = new Date(`${date}T${time}`);
      const args = {
	datetime,
	duration,
	patient: patient[0],
	phone,
	reason,
      } ;
      console.debug(args);
      onSubmit(args, (err, res) => {
	if ( err ) console.error( err ) ;
	else {
	  console.log(`Consultation #${res} created.`)
	  onClose();
	}
      });
    }
    else {
      this.setState({patientError: 'The patient\'s name is required'});
    }
  };

  render () {

    const {
      classes ,
      open ,
      onClose ,
      allPatients ,
      appointmentDuration ,
    } = this.props ;

    return (
	<Dialog
	  classes={{paper: classes.dialogPaper}}
	  open={open}
	  onClose={onClose}
	  component="form"
	  aria-labelledby="new-appointment-dialog-title"
	>
	  <DialogTitle id="new-appointment-dialog-title">Schedule an appointment</DialogTitle>
	  <DialogContent
	    className={classes.dialogPaper}
	  >
	    <Grid container>
	      <Grid item xs={4}>
		<TextField type="date"
			label="Date"
			InputLabelProps={{
			  shrink: true,
			}}
			value={this.state.date}
			onChange={e => this.setState({ date: e.target.value})}
		/>
	      </Grid>
	      <Grid item xs={4}>
		<TextField type="time"
			label="Time"
			InputLabelProps={{
				shrink: true,
			}}
			value={this.state.time}
			onChange={e => this.setState({ time: e.target.value})}
		/>
	      </Grid>
	      <Grid item xs={4}>
	      <FormControl>
		<InputLabel htmlFor="duration">Duration</InputLabel>
		<Select
			value={this.state.duration}
			onChange={e => this.setState({ duration: e.target.value})}
			inputProps={{
				name: 'duration',
				id: 'duration',
			}}
		>
		  {appointmentDuration.map(
		    x => <MenuItem key={x} value={x}>{msToString(x)}</MenuItem>
		  )}
		</Select>
	      </FormControl>
	      </Grid>
		<Grid item xs={12}>
			<SetPicker
			  readOnly={this.state.patientIsReadOnly}
			  suggestions={allPatients}
			  itemToKey={patients.toKey}
			  itemToString={patients.toString}
			  filter={patients.filter}
			  TextFieldProps={{
			    autoFocus: true,
			    label: "Patient's lastname then firstname(s)",
			    margin: "normal",
			    helperText: this.state.patientError,
			    error: !!this.state.patientError,
			  }}
			  value={this.state.patient}
			  onChange={e => this.setState({ patient : e.target.value })}
			  maxCount={1}
			  placeholder="Patient's lastname then firstname(s)"
			  createNewItem={patients.create}
			/>
		</Grid>
		<Grid item xs={12}>
		<TextField
			label="Numéro de téléphone"
			placeholder="Numéro de téléphone"
			multiline
			rows={1}
			className={classes.multiline}
			value={this.state.phone}
			margin="normal"
			disabled={this.state.patient.length !== 1 || this.state.patient[0]._id !== '?'}
			onChange={e => this.setState({ phone : e.target.value })}
		/>
		</Grid>
		<Grid item xs={12}>
			<TextField
				label="Motif de la visite"
				placeholder="Motif de la visite"
				multiline
				rows={4}
				className={classes.multiline}
				value={this.state.reason}
				onChange={e => this.setState({ reason: e.target.value})}
				margin="normal"
			/>
		</Grid>
	    </Grid>
	  </DialogContent>
	  <DialogActions>
	    <Button type="submit" onClick={onClose} color="default">
	      Cancel
	      <CancelIcon className={classes.rightIcon}/>
	    </Button>
	    <Button disabled={this.state.patient.length !== 1} onClick={this.createAppointment} color="primary">
	      Schedule
	      <AccessTimeIcon className={classes.rightIcon}/>
	    </Button>
	  </DialogActions>
	</Dialog>
    );
  }

}

AppointmentDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  allPatients: PropTypes.array.isRequired,
  appointmentDuration: PropTypes.array.isRequired,
  initialDatetime: PropTypes.instanceOf(Date).isRequired,
  initialPatient: PropTypes.object,
} ;

export default withTracker(props => {

  const {
    initialPatient,
  } = props ;

  const appointmentDurationHandle = settings.subscribe('appointment-duration') ;

  const additionalProps = {
      allPatients: [],
      appointmentDuration: [ 0 ],
  } ;

  if (!initialPatient) {
    Meteor.subscribe('patients');
    additionalProps.allPatients = Patients.find({}, { sort: { lastname: 1 } }).fetch();
  }

  if (appointmentDurationHandle.ready()) {
    additionalProps.appointmentDuration = settings.get('appointment-duration') ;
  }

  return additionalProps ;

}) ( withStyles(styles, { withTheme: true }) (AppointmentDialog) ) ;
