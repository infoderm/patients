import React from 'react';
import {styled} from '@mui/material/styles';
import {useNavigate} from 'react-router-dom';
import classNames from 'classnames';

import dateFormat from 'date-fns/format';
import isToday from 'date-fns/isToday';

import LinearProgress from '@mui/material/LinearProgress';

import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
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
import useConsultationsForPatient from './useConsultationsForPatient';

const PREFIX = 'ManageConsultationsForPatientDialog';

const classes = {
	avatarBegin: `${PREFIX}-avatarBegin`,
	avatarEdit: `${PREFIX}-avatarEdit`,
	avatarSchedule: `${PREFIX}-avatarSchedule`,
};

const StyledDialog = styled(Dialog)({
	[`& .${classes.avatarBegin}`]: {
		backgroundColor: green[100],
		color: green[600],
	},
	[`& .${classes.avatarEdit}`]: {
		backgroundColor: blue[100],
		color: blue[600],
	},
	[`& .${classes.avatarSchedule}`]: {
		backgroundColor: orange[100],
		color: orange[600],
	},
});

const formatDatetime = (datetime: Date) => {
	if (isToday(datetime)) {
		return `d'aujourd'hui à ${dateFormat(datetime, 'HH:mm')}`;
	}

	return `du ${dateFormat(datetime, 'dd/MM/yyyy à HH:mm')}`;
};

interface Props {
	onClose: () => void;
	open: boolean;
	patientId: string;
}

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
		<StyledDialog open={open} onClose={onClose}>
			{loading && <LinearProgress />}
			<DialogTitle>What do you want to do?</DialogTitle>
			<List>
				{appointments.map(({_id, datetime}, i) => (
					<ListItem
						key={_id}
						button
						autoFocus={i === 0}
						onClick={beginThisConsultation(_id)}
					>
						<ListItemAvatar>
							<Avatar
								className={classNames({
									[classes.avatarBegin]: isToday(datetime),
								})}
							>
								<AlarmIcon />
							</Avatar>
						</ListItemAvatar>
						<ListItemText
							primary={`Commencer le rendez-vous ${formatDatetime(datetime)}`}
						/>
					</ListItem>
				))}
				{consultations.map(({_id, datetime}) => (
					<ListItem key={_id} button onClick={editExistingConsultation(_id)}>
						<ListItemAvatar>
							<Avatar
								className={classNames({
									[classes.avatarEdit]: isToday(datetime),
								})}
							>
								<BookmarkIcon />
							</Avatar>
						</ListItemAvatar>
						<ListItemText
							primary={`Éditer la consultation ${formatDatetime(datetime)}`}
						/>
					</ListItem>
				))}
				<ListItem button onClick={scheduleNewAppointment}>
					<ListItemAvatar>
						<Avatar
							className={classNames({
								[classes.avatarSchedule]: appointments.length === 0,
							})}
						>
							<TodayIcon />
						</Avatar>
					</ListItemAvatar>
					<ListItemText primary="Programmer un nouveau rendez-vous" />
				</ListItem>
				<ListItem button onClick={createNewConsultation}>
					<ListItemAvatar>
						<Avatar>
							<NewReleasesIcon />
						</Avatar>
					</ListItemAvatar>
					<ListItemText primary="Créer une nouvelle consultation vierge" />
				</ListItem>
			</List>
		</StyledDialog>
	);
};

export default withLazyOpening(ManageConsultationsForPatientDialog);
