import React from 'react';

import AlarmOffIcon from '@material-ui/icons/AlarmOff';
import AlarmOnIcon from '@material-ui/icons/AlarmOn';

import uncancel from '../../api/endpoint/appointments/uncancel';

import EndpointCallConfirmationDialog from '../modal/EndpointCallConfirmationDialog';
import withLazyOpening from '../modal/withLazyOpening';

interface Props {
	open: boolean;
	onClose: () => void;
	appointment: {_id: string};
}

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
		cancelColor="default"
		confirm="Uncancel Appointment"
		ConfirmIcon={AlarmOnIcon}
		confirmColor="primary"
		endpoint={uncancel}
		args={[appointment._id]}
		onClose={onClose}
	/>
);

export default withLazyOpening(AppointmentUncancellationDialog);
