import React from 'react';
import {useHistory} from 'react-router-dom';
import classNames from 'classnames';

import dateFormat from 'date-fns/format';
import isToday from 'date-fns/isToday';

import LinearProgress from '@material-ui/core/LinearProgress';

import PropTypes from 'prop-types';
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

import call from '../../api/call';
import withLazyOpening from '../modal/withLazyOpening';

import useUpcomingAppointmentsForPatient from '../appointments/useUpcomingAppointmentsForPatient';
import useConsultationsForPatient from '../consultations/useConsultationsForPatient';

const formatDatetime = (datetime) => {
	if (isToday(datetime)) {
		return `d'aujourd'hui à ${dateFormat(datetime, 'HH:mm')}`;
	}

	return `du ${dateFormat(datetime, 'dd/MM/yyyy à HH:mm')}`;
};

const useStyles = makeStyles({
	avatarBegin: {
		backgroundColor: green[100],
		color: green[600]
	},
	avatarEdit: {
		backgroundColor: blue[100],
		color: blue[600]
	},
	avatarSchedule: {
		backgroundColor: orange[100],
		color: orange[600]
	}
});

const ManageConsultationsForPatientDialog = ({open, onClose, patientId}) => {
	const classes = useStyles();
	const history = useHistory();

	const {loading: loadingAppointments, results: appointments} =
		useUpcomingAppointmentsForPatient(patientId, {
			limit: 2
		});
	const {loading: loadingConsultations, results: consultations} =
		useConsultationsForPatient(patientId, {
			limit: 3
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

	const beginConsultation = (_id) => async () => {
		try {
			await call('appointments.beginConsultation', _id);
			console.log(`Consultation #${_id} started.`);
			history.push({pathname: `/edit/consultation/${_id}`});
		} catch (error) {
			console.error(error);
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
						onClick={beginConsultation(_id)}
					>
						<ListItemAvatar>
							<Avatar
								className={classNames({
									[classes.avatarBegin]: isToday(datetime)
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
									[classes.avatarEdit]: isToday(datetime)
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
								[classes.avatarSchedule]: appointments.length === 0
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

ManageConsultationsForPatientDialog.propTypes = {
	onClose: PropTypes.func.isRequired,
	open: PropTypes.bool.isRequired,
	patientId: PropTypes.string.isRequired
};

export default withLazyOpening(ManageConsultationsForPatientDialog);
