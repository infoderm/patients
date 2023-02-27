import React from 'react';
import {styled} from '@mui/material/styles';
import {useNavigate} from 'react-router-dom';

import dateFormat from 'date-fns/format';
import isToday from 'date-fns/isToday';

import LinearProgress from '@mui/material/LinearProgress';

import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import AlarmIcon from '@mui/icons-material/Alarm';
import TodayIcon from '@mui/icons-material/Today';

import {blue, green, orange} from '@mui/material/colors';

import call from '../../api/endpoint/call';
import withLazyOpening from '../modal/withLazyOpening';

import useUpcomingAppointmentsForPatient from '../appointments/useUpcomingAppointmentsForPatient';
import beginConsultation from '../../api/endpoint/appointments/beginConsultation';
import type PropsOf from '../../lib/types/PropsOf';
import {type AppointmentDocument} from '../../api/collection/appointments';
import {type ConsultationDocument} from '../../api/collection/consultations';
import useConsultationsForPatient from './useConsultationsForPatient';

const PREFIX = 'ManageConsultationsForPatientDialog';

const classes = {
	iconBegin: `${PREFIX}-iconBegin`,
	iconEdit: `${PREFIX}-iconEdit`,
	iconSchedule: `${PREFIX}-iconSchedule`,
};

const formatDatetime = (datetime: Date) => {
	if (isToday(datetime)) {
		return `d'aujourd'hui à ${dateFormat(datetime, 'HH:mm')}`;
	}

	return `du ${dateFormat(datetime, 'dd/MM/yyyy à HH:mm')}`;
};

type Props = {
	onClose: () => void;
	open: boolean;
	patientId: string;
};

type BeginConsultationItemProps = PropsOf<typeof ListItemButton> & {
	appointment: AppointmentDocument;
};

const BeginConsultationItem = styled(
	({appointment: {datetime}, ...rest}: BeginConsultationItemProps) => (
		<ListItemButton {...rest}>
			<ListItemAvatar>
				<Avatar className={isToday(datetime) ? classes.iconBegin : undefined}>
					<AlarmIcon />
				</Avatar>
			</ListItemAvatar>
			<ListItemText
				primary={`Commencer le rendez-vous ${formatDatetime(datetime)}`}
			/>
		</ListItemButton>
	),
)({
	[`& .${classes.iconBegin}`]: {
		backgroundColor: green[100],
		color: green[600],
	},
});

type EditExistingConsultationItemProps = PropsOf<typeof ListItemButton> & {
	consultation: ConsultationDocument;
};

const EditExistingConsultationItem = styled(
	({consultation: {datetime}, ...rest}: EditExistingConsultationItemProps) => (
		<ListItemButton {...rest}>
			<ListItemAvatar>
				<Avatar className={isToday(datetime) ? classes.iconEdit : undefined}>
					<BookmarkIcon />
				</Avatar>
			</ListItemAvatar>
			<ListItemText
				primary={`Éditer la consultation ${formatDatetime(datetime)}`}
			/>
		</ListItemButton>
	),
)({
	[`& .${classes.iconEdit}`]: {
		backgroundColor: blue[100],
		color: blue[600],
	},
});

type ScheduleNewAppointmentItemProps = PropsOf<typeof ListItemButton> & {
	emphasize: boolean;
};

const ScheduleNewAppointmentItem = styled(
	({emphasize, ...rest}: ScheduleNewAppointmentItemProps) => (
		<ListItemButton {...rest}>
			<ListItemAvatar>
				<Avatar className={emphasize ? classes.iconSchedule : undefined}>
					<TodayIcon />
				</Avatar>
			</ListItemAvatar>
			<ListItemText primary="Programmer un nouveau rendez-vous" />
		</ListItemButton>
	),
)({
	[`& .${classes.iconSchedule}`]: {
		backgroundColor: orange[100],
		color: orange[600],
	},
});

const ManageConsultationsForPatientDialog = ({
	open,
	onClose,
	patientId,
}: Props) => {
	const navigate = useNavigate();

	const {loading: loadingAppointments, results: appointments} =
		useUpcomingAppointmentsForPatient(patientId, {
			limit: 2,
		});
	const {loading: loadingConsultations, results: consultations} =
		useConsultationsForPatient(patientId, {
			limit: 3,
		});

	const createNewConsultation = () => {
		navigate(`/new/consultation/for/${patientId}`);
	};

	const scheduleNewAppointment = () => {
		navigate(`/new/appointment/for/${patientId}/week/current`);
	};

	const editExistingConsultation = (_id) => () => {
		navigate(`/edit/consultation/${_id}`);
	};

	const beginThisConsultation = (_id) => async () => {
		try {
			await call(beginConsultation, _id);
			console.log(`Consultation #${_id} started.`);
			navigate({pathname: `/edit/consultation/${_id}`});
		} catch (error: unknown) {
			console.error({error});
		}
	};

	const loading = loadingAppointments || loadingConsultations;

	return (
		<Dialog open={open} onClose={onClose}>
			{loading && <LinearProgress />}
			<DialogTitle>What do you want to do?</DialogTitle>
			<List>
				{appointments.map((appointment, i) => (
					<BeginConsultationItem
						key={appointment._id}
						appointment={appointment}
						autoFocus={i === 0}
						onClick={beginThisConsultation(appointment._id)}
					/>
				))}
				{consultations.map((consultation) => (
					<EditExistingConsultationItem
						key={consultation._id}
						consultation={consultation}
						onClick={editExistingConsultation(consultation._id)}
					/>
				))}
				<ScheduleNewAppointmentItem
					emphasize={appointments.length === 0}
					onClick={scheduleNewAppointment}
				/>
				<ListItemButton onClick={createNewConsultation}>
					<ListItemAvatar>
						<Avatar>
							<NewReleasesIcon />
						</Avatar>
					</ListItemAvatar>
					<ListItemText primary="Créer une nouvelle consultation vierge" />
				</ListItemButton>
			</List>
		</Dialog>
	);
};

export default withLazyOpening(ManageConsultationsForPatientDialog);
