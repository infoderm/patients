import React from 'react';

import withLazyOpening from '../modal/withLazyOpening';
import call from '../../api/endpoint/call';
import reschedule from '../../api/endpoint/appointments/reschedule';
import {AppointmentDocument} from '../../api/collection/appointments';
import AppointmentFromPatientIdDialog from './AppointmentFromPatientIdDialog';

interface Props {
	open: boolean;
	onClose: () => void;
	appointment: AppointmentDocument;
}

const EditAppointmentDialog = ({open, onClose, appointment}: Props) => {
	const onSubmit = async (args) => call(reschedule, appointment._id, args);

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

export default withLazyOpening(EditAppointmentDialog);
