import React from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';

import appointmentsRemove from '../../api/endpoint/appointments/remove';

import EndpointCallConfirmationDialog from '../modal/EndpointCallConfirmationDialog';
import withLazyOpening from '../modal/withLazyOpening';

type Props = {
	open: boolean;
	onClose: () => void;
	appointment: {_id: string};
};

const AppointmentDeletionDialog = ({open, onClose, appointment}: Props) => (
	<EndpointCallConfirmationDialog
		open={open}
		title="Delete this appointment"
		text="If you do not want to delete this appointment, click cancel. If you really want to delete this appointment from the system, click delete."
		cancel="Cancel"
		CancelIcon={CancelIcon}
		confirm="Delete"
		ConfirmIcon={DeleteIcon}
		confirmColor="secondary"
		endpoint={appointmentsRemove}
		args={[appointment._id]}
		onClose={onClose}
	/>
);

export default withLazyOpening(AppointmentDeletionDialog);
