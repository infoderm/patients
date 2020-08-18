import { Meteor } from 'meteor/meteor' ;
import { withTracker } from 'meteor/react-meteor-data' ;

import React, { useState } from 'react';

import { Link , useHistory } from 'react-router-dom';

import isSameDay from 'date-fns/isSameDay';
import startOfMonth from 'date-fns/startOfMonth';
import dateFormat from 'date-fns/format';
import addMonths from 'date-fns/addMonths';
import subMonths from 'date-fns/subMonths';

import { Consultations } from '../../api/consultations.js';

import MonthlyCalendar from '../calendar/MonthlyCalendar.js';
import calendarRanges from '../calendar/ranges.js';

import NewAppointmentDialog from '../appointments/NewAppointmentDialog.js';

function DayHeader ( { className , day , row , col } ) {
	const firstDayOfMonth = startOfMonth(day);
	const displayFormat = isSameDay(day, firstDayOfMonth) ? 'MMM d' : 'd' ;
	return (
		<div className={className}>
			<Link
				to={`/calendar/day/${dateFormat(day, 'yyyy-MM-dd')}`}
			>
				{dateFormat(day, displayFormat)}
			</Link>
		</div>
	) ;
}

function MonthlyPlanner ( props ) {

	const {
		year,
		month,
		weekOptions,
		firstDayOfMonth,
		firstDayOfNextMonth,
		firstDayOfPrevMonth,
		consultations,
	} = props ;

	const [selectedSlot, setSelectedSlot] = useState(new Date());
	const [creatingAppointment, setCreatingAppointment] = useState(false);
	const history = useHistory();

	const prevMonth = dateFormat(firstDayOfPrevMonth, 'yyyy/MM');
	const nextMonth = dateFormat(firstDayOfNextMonth, 'yyyy/MM');
	const firstWeekOfMonth = dateFormat(firstDayOfMonth, 'yyyy/ww');

	const onSlotClick = slot => {
		console.debug(slot);
		setSelectedSlot(slot);
		setCreatingAppointment(true);
	};

	const onEventClick = event => {
		console.debug(event);
	};

	console.debug(consultations);

	const events = [];

	for ( const consultation of consultations ) {
		const event = {
			begin: consultation.datetime ,
			title: consultation._id ,
		} ;
		events.push(event);
	}

	console.debug(events);

	return (
		<div>
			<MonthlyCalendar
				year={year}
				month={month}
				prev={ e => history.push(`/calendar/month/${prevMonth}`) }
				next={ e => history.push(`/calendar/month/${nextMonth}`) }
				weekly={ e => history.push(`/calendar/week/${firstWeekOfMonth}`) }
				events={events}
				DayHeader={DayHeader}
				onSlotClick={onSlotClick}
				onEventClick={onEventClick}
				{...weekOptions}
			/>
			<NewAppointmentDialog
				initialDatetime={selectedSlot}
				open={creatingAppointment}
				onClose={e => setCreatingAppointment(false)}
			/>
		</div>
	);

}

export default withTracker(({ match }) => {

	const year = parseInt(match.params.year, 10);
	const month = parseInt(match.params.month, 10);

	const weekOptions = {
		weekStartsOn: 1,
	};

	const [begin, end] = calendarRanges.monthly(year, month, weekOptions);

	console.debug(begin, end);

	const firstDayOfMonth = new Date(year, month-1, 1);
	const firstDayOfPrevMonth = subMonths(firstDayOfMonth, 1);
	const firstDayOfNextMonth = addMonths(firstDayOfMonth, 1);

	Meteor.subscribe('consultations.interval', begin, end);

	return {
		year,
		month,
		weekOptions,
		firstDayOfMonth,
		firstDayOfNextMonth,
		firstDayOfPrevMonth,
		consultations: Consultations.find(
			{
				datetime : {
					$gte : begin ,
					$lt : end ,
				}
			},
			{
				sort: {
					datetime: 1,
				},
			}
		).fetch() ,
	} ;

}) (MonthlyPlanner) ;
