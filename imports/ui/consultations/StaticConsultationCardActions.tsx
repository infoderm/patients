import React, {useState} from 'react';
import PropTypes from 'prop-types';

import {Link, useNavigate} from 'react-router-dom';

import AccordionActions from '@material-ui/core/AccordionActions';

import Button from '@material-ui/core/Button';

import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import EditIcon from '@material-ui/icons/Edit';
import ScheduleIcon from '@material-ui/icons/Schedule';
import EuroSymbolIcon from '@material-ui/icons/EuroSymbol';
import SmartphoneIcon from '@material-ui/icons/Smartphone';
import FolderSharedIcon from '@material-ui/icons/FolderShared';
import AlarmOffIcon from '@material-ui/icons/AlarmOff';
import AlarmOnIcon from '@material-ui/icons/AlarmOn';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

import consultationsAttach from '../../api/endpoint/consultations/attach';

import AttachFileButton from '../attachments/AttachFileButton';

import AppointmentCancellationDialog from '../appointments/AppointmentCancellationDialog';
import AppointmentUncancellationDialog from '../appointments/AppointmentUncancellationDialog';
import EditAppointmentDialog from '../appointments/EditAppointmentDialog';

import call from '../../api/endpoint/call';
import beginConsultation from '../../api/endpoint/appointments/beginConsultation';
import ConsultationPaymentDialog from './ConsultationPaymentDialog';
import ConsultationDebtSettlementDialog from './ConsultationDebtSettlementDialog';
import ConsultationAdvancedActionsDialog from './ConsultationAdvancedActionsDialog';

const StaticConsultationCardActions = (props) => {
	const [paying, setPaying] = useState(false);
	const [settling, setSettling] = useState(false);
	const [more, setMore] = useState(false);
	const [editing, setEditing] = useState(false);
	const [cancelling, setCancelling] = useState(false);
	const [uncancelling, setUncancelling] = useState(false);

	const navigate = useNavigate();

	const {
		found,
		attachAction,
		editAction,
		moreAction,
		owes,
		consultation: {_id, isDone, isCancelled, payment_method},
	} = props;

	const beginThisConsultation = async () => {
		try {
			await call(beginConsultation, _id);
			console.log(`Consultation #${_id} started.`);
			navigate(`/edit/consultation/${_id}`);
		} catch (error: unknown) {
			console.error(error);
		}
	};

	return (
		<AccordionActions>
			{attachAction && (
				<AttachFileButton
					color="primary"
					endpoint={consultationsAttach}
					item={_id}
					disabled={!found}
				/>
			)}
			{!isDone && !isCancelled && (
				<Button
					color="primary"
					disabled={!found}
					startIcon={<FolderSharedIcon />}
					onClick={beginThisConsultation}
				>
					Begin consultation
				</Button>
			)}
			{editAction &&
				(isDone ? (
					<Button
						color="primary"
						component={Link}
						to={`/edit/consultation/${_id}`}
						disabled={!found}
						endIcon={<EditIcon />}
					>
						Edit
					</Button>
				) : (
					!isCancelled && (
						<Button
							color="primary"
							disabled={!found}
							endIcon={<ScheduleIcon />}
							onClick={() => {
								setEditing(true);
							}}
						>
							Reschedule
						</Button>
					)
				))}
			{owes && payment_method === 'wire' && (
				<Button
					color="primary"
					disabled={!found}
					endIcon={<SmartphoneIcon />}
					onClick={() => {
						setPaying(true);
					}}
				>
					Pay by Phone
				</Button>
			)}
			{owes && (
				<Button
					color="primary"
					disabled={!found}
					endIcon={<EuroSymbolIcon />}
					onClick={() => {
						setSettling(true);
					}}
				>
					Settle debt
				</Button>
			)}
			{!isDone &&
				(isCancelled ? (
					<Button
						color="primary"
						disabled={!found}
						endIcon={<AlarmOnIcon />}
						onClick={() => {
							setUncancelling(true);
						}}
					>
						Uncancel
					</Button>
				) : (
					<Button
						color="secondary"
						disabled={!found}
						endIcon={<AlarmOffIcon />}
						onClick={() => {
							setCancelling(true);
						}}
					>
						Cancel
					</Button>
				))}
			{moreAction && (
				<Button
					disabled={!found}
					endIcon={<MoreHorizIcon />}
					onClick={() => {
						setMore(true);
					}}
				>
					More
				</Button>
			)}
			{!owes || payment_method !== 'wire' ? null : (
				<ConsultationPaymentDialog
					open={paying}
					consultation={props.consultation}
					onClose={() => {
						setPaying(false);
					}}
				/>
			)}
			{!owes ? null : (
				<ConsultationDebtSettlementDialog
					open={settling}
					consultation={props.consultation}
					onClose={() => {
						setSettling(false);
					}}
				/>
			)}
			{moreAction && (
				<ConsultationAdvancedActionsDialog
					open={more}
					onClose={() => {
						setMore(false);
					}}
					{...props}
				/>
			)}
			{!isDone && isCancelled ? (
				<AppointmentUncancellationDialog
					open={uncancelling}
					appointment={props.consultation}
					onClose={() => {
						setUncancelling(false);
					}}
				/>
			) : (
				<AppointmentCancellationDialog
					open={cancelling}
					appointment={props.consultation}
					onClose={() => {
						setCancelling(false);
					}}
				/>
			)}
			{editAction && !isDone && !isCancelled && (
				<EditAppointmentDialog
					open={editing}
					appointment={props.consultation}
					onClose={() => {
						setEditing(false);
					}}
				/>
			)}
			{!editAction && (
				<Button
					color="primary"
					component={Link}
					target="_blank"
					to={`/consultation/${_id}`}
					disabled={!found}
					endIcon={<OpenInNewIcon />}
				>
					Open in new tab
				</Button>
			)}
		</AccordionActions>
	);
};

StaticConsultationCardActions.projection = {
	_id: 1,
	isDone: 1,
	payment_method: 1,
};

StaticConsultationCardActions.defaultProps = {
	found: true,
	attachAction: true,
	editAction: true,
	moreAction: true,
};

StaticConsultationCardActions.propTypes = {
	found: PropTypes.bool,
	attachAction: PropTypes.bool,
	editAction: PropTypes.bool,
	moreAction: PropTypes.bool,
	consultation: PropTypes.object.isRequired,
};

export default StaticConsultationCardActions;
