import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';

import React, {useState} from 'react';

import {Link, useHistory} from 'react-router-dom';

import {makeStyles} from '@material-ui/core/styles';

import Fab from '@material-ui/core/Fab';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

import isSameDay from 'date-fns/isSameDay';
import startOfMonth from 'date-fns/startOfMonth';
import dateFormat from 'date-fns/format';
import addMonths from 'date-fns/addMonths';
import subMonths from 'date-fns/subMonths';

import {Events} from '../../api/events.js';
import {useSetting} from '../../client/settings.js';

import Loading from '../navigation/Loading.js';

import MonthlyCalendar from '../calendar/MonthlyCalendar.js';
import {monthly} from '../calendar/ranges.js';
import {ALL_WEEK_DAYS} from '../calendar/constants.js';

import NewAppointmentDialog from '../appointments/NewAppointmentDialog.js';

const DayHeader = ({className, day}) => {
	const firstDayOfMonth = startOfMonth(day);
	const displayFormat = isSameDay(day, firstDayOfMonth) ? 'MMM d' : 'd';
	return (
		<div className={className}>
			<Link to={`/calendar/day/${dateFormat(day, 'yyyy-MM-dd')}`}>
				{dateFormat(day, displayFormat)}
			</Link>
		</div>
	);
};

const useStyles = makeStyles((theme) => ({
	calendar: {
		marginBottom: '6em'
	},
	displayAllWeekDaysToggle: {
		position: 'fixed',
		bottom: theme.spacing(3),
		right: theme.spacing(21)
	}
}));

const MonthlyPlanner = (props) => {
	const {
		year,
		month,
		weekOptions,
		firstDayOfMonth,
		firstDayOfNextMonth,
		firstDayOfPrevMonth,
		events
	} = props;

	const [selectedSlot, setSelectedSlot] = useState(new Date());
	const [creatingAppointment, setCreatingAppointment] = useState(false);
	const [displayAllWeekDays, setDisplayAllWeekDays] = useState(false);
	const history = useHistory();
	const {loading, value: displayedWeekDays} = useSetting('displayed-week-days');
	const classes = useStyles();

	if (loading) return <Loading />;

	const previousMonth = dateFormat(firstDayOfPrevMonth, 'yyyy/MM');
	const nextMonth = dateFormat(firstDayOfNextMonth, 'yyyy/MM');
	const firstWeekOfMonth = dateFormat(firstDayOfMonth, 'yyyy/ww');

	const onSlotClick = (slot) => {
		console.debug(slot);
		setSelectedSlot(slot);
		setCreatingAppointment(true);
	};

	const onEventClick = (event) => {
		console.debug(event);
	};

	console.debug(events);

	return (
		<>
			<MonthlyCalendar
				className={classes.calendar}
				year={year}
				month={month}
				prev={() => history.push(`/calendar/month/${previousMonth}`)}
				next={() => history.push(`/calendar/month/${nextMonth}`)}
				weekly={() => history.push(`/calendar/week/${firstWeekOfMonth}`)}
				events={events}
				DayHeader={DayHeader}
				weekOptions={weekOptions}
				displayedWeekDays={
					displayAllWeekDays ? ALL_WEEK_DAYS : displayedWeekDays
				}
				onSlotClick={onSlotClick}
				onEventClick={onEventClick}
			/>
			<NewAppointmentDialog
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
		</>
	);
};

export default withTracker(({match}) => {
	const year = Number.parseInt(match.params.year, 10);
	const month = Number.parseInt(match.params.month, 10);

	const weekOptions = {
		weekStartsOn: 1
	};

	const [begin, end] = monthly(year, month, weekOptions);

	console.debug(begin, end);

	const firstDayOfMonth = new Date(year, month - 1, 1);
	const firstDayOfPreviousMonth = subMonths(firstDayOfMonth, 1);
	const firstDayOfNextMonth = addMonths(firstDayOfMonth, 1);

	Meteor.subscribe('events.interval', begin, end);

	return {
		year,
		month,
		weekOptions,
		firstDayOfMonth,
		firstDayOfNextMonth,
		firstDayOfPrevMonth: firstDayOfPreviousMonth,
		events: Events.find(
			{
				begin: {
					$gte: begin,
					$lt: end
				}
			},
			{
				sort: {
					begin: 1
				}
			}
		).fetch()
	};
})(MonthlyPlanner);
