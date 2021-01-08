import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';

import React, {useState} from 'react';

import {Link, useHistory} from 'react-router-dom';

import isSameDay from 'date-fns/isSameDay';
import startOfWeek from 'date-fns/startOfWeek';
import dateFormat from 'date-fns/format';
import addWeeks from 'date-fns/addWeeks';
import subWeeks from 'date-fns/subWeeks';
import isFirstDayOfMonth from 'date-fns/isFirstDayOfMonth';

import {Events} from '../../api/events.js';

import WeeklyCalendar from '../calendar/WeeklyCalendar.js';
import calendarRanges from '../calendar/ranges.js';

import NewAppointmentDialog from '../appointments/NewAppointmentDialog.js';

const DayHeader = ({className, day, weekOptions}) => {
	const firstDayOfWeek = startOfWeek(day, weekOptions);
	const displayFormat = isFirstDayOfMonth(day) || isSameDay(day, firstDayOfWeek) ? 'MMM d' : 'd';
	return (
		<div className={className}>
			<Link to={`/calendar/day/${dateFormat(day, 'yyyy-MM-dd')}`}>
				{dateFormat(day, displayFormat)}
			</Link>
		</div>
	);
};

const WeeklyPlanner = (props) => {
	const {
		year,
		week,
		weekOptions,
		nextWeek,
		prevWeek,
		monthOfWeek,
		events
	} = props;

	const [selectedSlot, setSelectedSlot] = useState(new Date());
	const [creatingAppointment, setCreatingAppointment] = useState(false);
	const history = useHistory();

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
		<div>
			<WeeklyCalendar
				year={year}
				week={week}
				prev={() => history.push(`/calendar/week/${prevWeek}`)}
				next={() => history.push(`/calendar/week/${nextWeek}`)}
				monthly={() => history.push(`/calendar/month/${monthOfWeek}`)}
				events={events}
				DayHeader={DayHeader}
				weekOptions={weekOptions}
				onSlotClick={onSlotClick}
				onEventClick={onEventClick}
			/>
			<NewAppointmentDialog
				initialDatetime={selectedSlot}
				open={creatingAppointment}
				onClose={() => setCreatingAppointment(false)}
			/>
		</div>
	);
};

export default withTracker(({match}) => {
	const year = Number.parseInt(match.params.year, 10);
	const week = Number.parseInt(match.params.week, 10);

	const weekOptions = {
		useAdditionalWeekYearTokens: true,
		weekStartsOn: 1,
		firstWeekContainsDate: 1
	};

	const [begin, end] = calendarRanges.weekly(year, week, weekOptions);

	console.debug(begin, end);

	const someDayOfWeek = new Date(
		year,
		0,
		weekOptions.firstWeekContainsDate + (week - 1) * 7
	);
	const someDayOfPrevWeek = subWeeks(someDayOfWeek, 1);
	const someDayOfNextWeek = addWeeks(someDayOfWeek, 1);
	const prevWeek = dateFormat(someDayOfPrevWeek, 'YYYY/ww', weekOptions);
	const nextWeek = dateFormat(someDayOfNextWeek, 'YYYY/ww', weekOptions);
	const monthOfWeek = dateFormat(someDayOfWeek, 'yyyy/MM');

	Meteor.subscribe('events.interval', begin, end);

	return {
		year,
		week,
		weekOptions,
		nextWeek,
		prevWeek,
		monthOfWeek,
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
})(WeeklyPlanner);
