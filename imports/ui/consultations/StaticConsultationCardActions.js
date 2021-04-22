import {Meteor} from 'meteor/meteor';

import React, {useState} from 'react';
import PropTypes from 'prop-types';

import {Link, useHistory} from 'react-router-dom';

import AccordionActions from '@material-ui/core/AccordionActions';

import Button from '@material-ui/core/Button';

import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import EditIcon from '@material-ui/icons/Edit';
import ScheduleIcon from '@material-ui/icons/Schedule';
import DeleteIcon from '@material-ui/icons/Delete';
import EuroSymbolIcon from '@material-ui/icons/EuroSymbol';
import SmartphoneIcon from '@material-ui/icons/Smartphone';
import FolderSharedIcon from '@material-ui/icons/FolderShared';
import AlarmOffIcon from '@material-ui/icons/AlarmOff';
import AlarmOnIcon from '@material-ui/icons/AlarmOn';
import RestoreIcon from '@material-ui/icons/Restore';

import AttachFileButton from '../attachments/AttachFileButton.js';

import AppointmentDeletionDialog from '../appointments/AppointmentDeletionDialog.js';
import AppointmentCancellationDialog from '../appointments/AppointmentCancellationDialog.js';
import AppointmentUncancellationDialog from '../appointments/AppointmentUncancellationDialog.js';
import EditAppointmentDialog from '../appointments/EditAppointmentDialog.js';

import ConsultationPaymentDialog from './ConsultationPaymentDialog.js';
import ConsultationDebtSettlementDialog from './ConsultationDebtSettlementDialog.js';
import ConsultationDeletionDialog from './ConsultationDeletionDialog.js';
import ConsultationAppointmentRestorationDialog from './ConsultationAppointmentRestorationDialog.js';

const StaticConsultationCardActions = (props) => {
	const [paying, setPaying] = useState(false);
	const [settling, setSettling] = useState(false);
	const [deleting, setDeleting] = useState(false);
	const [restoreAppointment, setRestoreAppointment] = useState(false);
	const [editing, setEditing] = useState(false);
	const [cancelling, setCancelling] = useState(false);
	const [uncancelling, setUncancelling] = useState(false);

	const history = useHistory();

	const {
		found,
		attachAction,
		editAction,
		deleteAction,
		owes,
		consultation: {_id, scheduledDatetime, isDone, isCancelled, payment_method}
	} = props;

	const beginConsultation = () => {
		Meteor.call('appointments.beginConsultation', _id, (err) => {
			if (err) {
				console.error(err);
			} else {
				console.log(`Consultation #${_id} started.`);
				history.push({pathname: `/edit/consultation/${_id}`});
			}
		});
	};

	return (
		<AccordionActions>
			{attachAction && (
				<AttachFileButton
					color="primary"
					method="consultations.attach"
					item={_id}
					disabled={!found}
				/>
			)}
			{!isDone && !isCancelled && (
				<Button color="primary" disabled={!found} onClick={beginConsultation}>
					Begin consultation
					<FolderSharedIcon />
				</Button>
			)}
			{editAction &&
				(isDone ? (
					<Button
						color="primary"
						component={Link}
						to={`/edit/consultation/${_id}`}
						disabled={!found}
					>
						Edit
						<EditIcon />
					</Button>
				) : (
					!isCancelled && (
						<Button
							color="primary"
							disabled={!found}
							onClick={() => setEditing(true)}
						>
							Reschedule
							<ScheduleIcon />
						</Button>
					)
				))}
			{owes && payment_method === 'wire' && (
				<Button
					color="primary"
					disabled={!found}
					onClick={() => setPaying(true)}
				>
					Pay by Phone
					<SmartphoneIcon />
				</Button>
			)}
			{owes && (
				<Button
					color="primary"
					disabled={!found}
					onClick={() => setSettling(true)}
				>
					Settle debt
					<EuroSymbolIcon />
				</Button>
			)}
			{!isDone &&
				(isCancelled ? (
					<Button
						color="primary"
						disabled={!found}
						onClick={() => setUncancelling(true)}
					>
						Uncancel
						<AlarmOnIcon />
					</Button>
				) : (
					<Button
						color="secondary"
						disabled={!found}
						onClick={() => setCancelling(true)}
					>
						Cancel
						<AlarmOffIcon />
					</Button>
				))}
			{isDone && scheduledDatetime && (
				<Button
					color="secondary"
					disabled={!found}
					onClick={() => setRestoreAppointment(true)}
				>
					Restore Appointment
					<RestoreIcon />
				</Button>
			)}
			{deleteAction && (
				<Button
					color="secondary"
					disabled={!found}
					onClick={() => setDeleting(true)}
				>
					Delete
					<DeleteIcon />
				</Button>
			)}
			{!owes || payment_method !== 'wire' ? null : (
				<ConsultationPaymentDialog
					open={paying}
					consultation={props.consultation}
					onClose={() => setPaying(false)}
				/>
			)}
			{!owes ? null : (
				<ConsultationDebtSettlementDialog
					open={settling}
					consultation={props.consultation}
					onClose={() => setSettling(false)}
				/>
			)}
			{deleteAction &&
				(isDone ? (
					<ConsultationDeletionDialog
						open={deleting}
						consultation={props.consultation}
						onClose={() => setDeleting(false)}
					/>
				) : (
					<AppointmentDeletionDialog
						open={deleting}
						appointment={props.consultation}
						onClose={() => setDeleting(false)}
					/>
				))}
			{!isDone && isCancelled ? (
				<AppointmentUncancellationDialog
					open={uncancelling}
					appointment={props.consultation}
					onClose={() => setUncancelling(false)}
				/>
			) : (
				<AppointmentCancellationDialog
					open={cancelling}
					appointment={props.consultation}
					onClose={() => setCancelling(false)}
				/>
			)}
			{isDone && scheduledDatetime && (
				<ConsultationAppointmentRestorationDialog
					open={restoreAppointment}
					consultation={props.consultation}
					onClose={() => setRestoreAppointment(false)}
				/>
			)}
			{editAction && !isDone && !isCancelled && (
				<EditAppointmentDialog
					open={editing}
					appointment={props.consultation}
					onClose={() => setEditing(false)}
				/>
			)}
			{!editAction && (
				<Button
					color="primary"
					component={Link}
					target="_blank"
					to={`/consultation/${_id}`}
					disabled={!found}
				>
					Open in new tab
					<OpenInNewIcon />
				</Button>
			)}
		</AccordionActions>
	);
};

StaticConsultationCardActions.projection = {
	_id: 1,
	isDone: 1,
	payment_method: 1
};

StaticConsultationCardActions.defaultProps = {
	found: true,
	attachAction: true,
	editAction: true,
	deleteAction: true
};

StaticConsultationCardActions.propTypes = {
	found: PropTypes.bool,
	attachAction: PropTypes.bool,
	editAction: PropTypes.bool,
	deleteAction: PropTypes.bool,
	consultation: PropTypes.object.isRequired
};

export default StaticConsultationCardActions;
