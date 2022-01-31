import React from 'react';

import withLazyOpening from '../modal/withLazyOpening';
import call from '../../api/endpoint/call';
import reschedule from '../../api/endpoint/appointments/reschedule';
import AppointmentFromPatientIdDialog from './AppointmentFromPatientIdDialog';

interface Props {
	open: boolean;
	onClose: () => void;
	appointment: {
		_id: string;
		patientId: string;
		datetime: Date;
	};
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
