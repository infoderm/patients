import React, {useState} from 'react';

import {makeStyles} from '@material-ui/core/styles';

import Fab from '@material-ui/core/Fab';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import AlarmOffIcon from '@material-ui/icons/AlarmOff';

import {useSettingCached} from '../../client/settings.js';

import {computeFixedFabStyle} from '../button/FixedFab.js';

import {ALL_WEEK_DAYS} from '../calendar/constants.js';

import NewAppointmentDialog from '../appointments/NewAppointmentDialog.js';

const useStyles = makeStyles((theme) => ({
	calendar: {
		marginBottom: '6em'
	},
	displayAllWeekDaysToggle: computeFixedFabStyle({theme, col: 3}),
	showCancelledEventsToggle: computeFixedFabStyle({theme, col: 4})
}));

const Planner = (props) => {
	const {Calendar, match} = props;

	const [selectedSlot, setSelectedSlot] = useState(new Date());
	const [creatingAppointment, setCreatingAppointment] = useState(false);
	const [displayAllWeekDays, setDisplayAllWeekDays] = useState(false);
	const [showCancelledEvents, setShowCancelledEvents] = useState(false);
	const {value: displayedWeekDays} = useSettingCached('displayed-week-days');
	const classes = useStyles();

	const onSlotClick = (slot) => {
		console.debug(slot);
		setSelectedSlot(slot);
		setCreatingAppointment(true);
	};

	return (
		<>
			<Calendar
				className={classes.calendar}
				match={match}
				displayedWeekDays={
					displayAllWeekDays ? ALL_WEEK_DAYS : displayedWeekDays
				}
				showCancelledEvents={showCancelledEvents}
				onSlotClick={onSlotClick}
			/>
			<NewAppointmentDialog
				noInitialTime
				initialDatetime={selectedSlot}
				open={creatingAppointment}
				onClose={() => setCreatingAppointment(false)}
			/>
			<Fab
				className={classes.displayAllWeekDaysToggle}
				color={displayAllWeekDays ? 'primary' : 'default'}
				onClick={() => setDisplayAllWeekDays(!displayAllWeekDays)}
			>
				{displayAllWeekDays ? <VisibilityIcon /> : <VisibilityOffIcon />}
			</Fab>
			<Fab
				className={classes.showCancelledEventsToggle}
				color={showCancelledEvents ? 'primary' : 'default'}
				onClick={() => setShowCancelledEvents(!showCancelledEvents)}
			>
				<AlarmOffIcon />
			</Fab>
		</>
	);
};

export default Planner;
