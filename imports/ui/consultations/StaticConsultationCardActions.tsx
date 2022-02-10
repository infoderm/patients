import React, {useState} from 'react';

import {Link, useNavigate} from 'react-router-dom';

import AccordionActions from '@mui/material/AccordionActions';

import Button from '@mui/material/Button';

import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import EditIcon from '@mui/icons-material/Edit';
import ScheduleIcon from '@mui/icons-material/Schedule';
import EuroSymbolIcon from '@mui/icons-material/EuroSymbol';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import AlarmOffIcon from '@mui/icons-material/AlarmOff';
import AlarmOnIcon from '@mui/icons-material/AlarmOn';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import PropsOf from '../../util/PropsOf';

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

interface Props
	extends Omit<
		PropsOf<typeof ConsultationAdvancedActionsDialog>,
		'open' | 'onClose'
	> {
	found?: boolean;
	attachAction?: boolean;
	editAction?: boolean;
	moreAction?: boolean;
	owes: boolean;
}

const StaticConsultationCardActions = ({
	found = true,
	attachAction = true,
	editAction = true,
	moreAction = true,
	owes,
	consultation,
	...rest
}: Props) => {
	const [paying, setPaying] = useState(false);
	const [settling, setSettling] = useState(false);
	const [more, setMore] = useState(false);
	const [editing, setEditing] = useState(false);
	const [cancelling, setCancelling] = useState(false);
	const [uncancelling, setUncancelling] = useState(false);

	const navigate = useNavigate();

	const {_id, isDone, isCancelled, payment_method} = consultation;

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
					consultation={consultation}
					onClose={() => {
						setPaying(false);
					}}
				/>
			)}
			{!owes ? null : (
				<ConsultationDebtSettlementDialog
					open={settling}
					consultation={consultation}
					onClose={() => {
						setSettling(false);
					}}
				/>
			)}
			{moreAction && (
				<ConsultationAdvancedActionsDialog
					open={more}
					owes={owes}
					consultation={consultation}
					onClose={() => {
						setMore(false);
					}}
					{...rest}
				/>
			)}
			{!isDone && isCancelled ? (
				<AppointmentUncancellationDialog
					open={uncancelling}
					appointment={consultation}
					onClose={() => {
						setUncancelling(false);
					}}
				/>
			) : (
				<AppointmentCancellationDialog
					open={cancelling}
					appointment={consultation}
					onClose={() => {
						setCancelling(false);
					}}
				/>
			)}
			{editAction && !isDone && !isCancelled && (
				<EditAppointmentDialog
					open={editing}
					appointment={consultation}
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

export default StaticConsultationCardActions;
