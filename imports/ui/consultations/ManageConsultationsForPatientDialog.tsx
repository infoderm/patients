import React from 'react';
import {useHistory} from 'react-router-dom';
import classNames from 'classnames';

import dateFormat from 'date-fns/format';
import isToday from 'date-fns/isToday';

import LinearProgress from '@material-ui/core/LinearProgress';

import {makeStyles} from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import NewReleasesIcon from '@material-ui/icons/NewReleases';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import AlarmIcon from '@material-ui/icons/Alarm';
import TodayIcon from '@material-ui/icons/Today';

import blue from '@material-ui/core/colors/blue';
import green from '@material-ui/core/colors/green';
import orange from '@material-ui/core/colors/orange';

import call from '../../api/endpoint/call';
import withLazyOpening from '../modal/withLazyOpening';

import useUpcomingAppointmentsForPatient from '../appointments/useUpcomingAppointmentsForPatient';
import beginConsultation from '../../api/endpoint/appointments/beginConsultation';
import useConsultationsForPatient from './useConsultationsForPatient';

const formatDatetime = (datetime: Date) => {
	if (isToday(datetime)) {
		return `d'aujourd'hui à ${dateFormat(datetime, 'HH:mm')}`;
	}

	return `du ${dateFormat(datetime, 'dd/MM/yyyy à HH:mm')}`;
};

const useStyles = makeStyles({
	avatarBegin: {
		backgroundColor: green[100],
		color: green[600],
	},
	avatarEdit: {
		backgroundColor: blue[100],
		color: blue[600],
	},
	avatarSchedule: {
		backgroundColor: orange[100],
		color: orange[600],
	},
});

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
	const classes = useStyles();
	const history = useHistory();

	const {loading: loadingAppointments, results: appointments} =
		useUpcomingAppointmentsForPatient(patientId, {
			limit: 2,
		});
	const {loading: loadingConsultations, results: consultations} =
		useConsultationsForPatient(patientId, {
			limit: 3,
		});

	const createNewConsultation = () => {
		history.push(`/new/consultation/for/${patientId}`);
	};

	const scheduleNewAppointment = () => {
		history.push(`/new/appointment/for/${patientId}`);
	};

	const editExistingConsultation = (_id) => () => {
		history.push(`/edit/consultation/${_id}`);
	};

	const beginThisConsultation = (_id) => async () => {
		try {
			await call(beginConsultation, _id);
			console.log(`Consultation #${_id} started.`);
			history.push({pathname: `/edit/consultation/${_id}`});
		} catch (error: unknown) {
			console.error({error});
		}
	};

	const loading = loadingAppointments || loadingConsultations;

	return (
		<Dialog aria-labelledby="simple-dialog-title" open={open} onClose={onClose}>
			{loading && <LinearProgress />}
			<DialogTitle id="simple-dialog-title">
				What do you want to do?
			</DialogTitle>
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
		</Dialog>
	);
};

export default withLazyOpening(ManageConsultationsForPatientDialog);
