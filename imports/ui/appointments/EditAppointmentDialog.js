import { Meteor } from 'meteor/meteor' ;

import React from 'react';
import PropTypes from 'prop-types';

import AppointmentDialog from './AppointmentDialog.js';

class EditAppointmentDialog extends React.Component {

  onSubmit = (args, callback) => {
    Meteor.call('appointment.update', args, callback);
  }

  render () {

    const {
      open,
      onClose,
      patient,
      appointment,
    } = this.props;

    return (
      <AppointmentDialog
        open={open}
        onClose={onClose}
        onSubmit={this.onSubmit}
        initialDatetime={appointment.datetime},
        initialPatient={patient},
      />
    );

  }

}

EditAppointmentDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  patient: PropTypes.object.isRequired,
  appointment: PropTypes.object.isRequired,
} ;

export default EditAppointmentDialog;
