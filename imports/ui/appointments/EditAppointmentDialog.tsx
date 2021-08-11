import {Meteor} from 'meteor/meteor';

import React from 'react';
import PropTypes, {InferProps} from 'prop-types';

import withLazyOpening from '../modal/withLazyOpening';
import AppointmentFromPatientIdDialog from './AppointmentFromPatientIdDialog';

const propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	appointment: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		patientId: PropTypes.string.isRequired,
		datetime: PropTypes.instanceOf(Date).isRequired,
	}).isRequired,
};

const EditAppointmentDialog = ({
	open,
	onClose,
	appointment,
}: InferProps<typeof propTypes>) => {
	const onSubmit = (args, callback) => {
		Meteor.call('appointments.reschedule', appointment._id, args, callback);
	};

	return (
		<AppointmentFromPatientIdDialog
			patientId={appointment.patientId}
			open={open}
			initialDatetime={appointment.datetime}
			initialAppointment={appointment}
			onClose={onClose}
			onSubmit={onSubmit}
		/>
	);
};

EditAppointmentDialog.propTypes = propTypes;

export default withLazyOpening(EditAppointmentDialog);
