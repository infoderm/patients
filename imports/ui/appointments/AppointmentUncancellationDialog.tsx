import React from 'react';

import AlarmOffIcon from '@mui/icons-material/AlarmOff';
import AlarmOnIcon from '@mui/icons-material/AlarmOn';

import uncancel from '../../api/endpoint/appointments/uncancel';

import EndpointCallConfirmationDialog from '../modal/EndpointCallConfirmationDialog';
import withLazyOpening from '../modal/withLazyOpening';

type Props = {
	open: boolean;
	onClose: () => void;
	appointment: {_id: string};
};

const AppointmentUncancellationDialog = ({
	open,
	onClose,
	appointment,
}: Props) => (
	<EndpointCallConfirmationDialog
		open={open}
		title="Cancel this appointment"
		text="If you do not want to cancel this appointment, click cancel. If you really want to cancel this appointment from the system, click cancel."
		cancel="Do not uncancel"
		CancelIcon={AlarmOffIcon}
		confirm="Uncancel Appointment"
		ConfirmIcon={AlarmOnIcon}
		confirmColor="primary"
		endpoint={uncancel}
		args={[appointment._id]}
		onClose={onClose}
	/>
);

export default withLazyOpening(AppointmentUncancellationDialog);
