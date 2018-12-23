import { Meteor } from 'meteor/meteor' ;

import React from 'react';
import PropTypes from 'prop-types';

import AppointmentDialog from './AppointmentDialog.js';

class NewAppointmentDialog extends React.Component {

  onSubmit = (args, callback) => {
    Meteor.call('consultations.schedule', args, callback);
  }

  render () {
    return (
      <AppointmentDialog
        onSubmit={this.onSubmit}
        {...this.props}
      />
    );
  }

}

NewAppointmentDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  initialDatetime: PropTypes.instanceOf(Date).isRequired,
  initialPatient: PropTypes.object,
} ;

export default NewAppointmentDialog;
