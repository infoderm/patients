import { Meteor } from 'meteor/meteor' ;
import { withTracker } from 'meteor/react-meteor-data' ;

import React from 'react';

import { Link } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';

import isSameDay from 'date-fns/is_same_day';
import startOfMonth from 'date-fns/start_of_month';
import dateFormat from 'date-fns/format';
import addMonths from 'date-fns/add_months';
import subMonths from 'date-fns/sub_months';

import { Consultations } from '../../api/consultations.js';

import MonthlyCalendar from '../calendar/MonthlyCalendar.js';

const styles = themes => ({});

function DayHeader ( { className , day , row , col } ) {
	const firstDayOfMonth = startOfMonth(day);
	const displayFormat = isSameDay(day, firstDayOfMonth) ? 'MMM D' : 'D' ;
	return (
		<div className={className}>
			<Link
				to={`/calendar/day/${dateFormat(day, 'YYYY-MM-DD')}`}
			>
				{dateFormat(day, displayFormat)}
			</Link>
		</div>
	) ;
}

const MonthlyPlanner = props => {

	const {
		history,
		year,
		month,
		firstDayOfMonth,
		firstDayOfNextMonth,
		firstDayOfPrevMonth,
		consultations,
	} = props ;

	const prevMonth = dateFormat(firstDayOfPrevMonth, 'YYYY/MM');
	const nextMonth = dateFormat(firstDayOfNextMonth, 'YYYY/MM');

	const events = [];

	for ( const consultation of consultations ) {
		const event = {
			begin: consultation.datetime ,
			end: consultation.createdAt ,
			title: consultation._id ,
		} ;
		events.push(event);
	}

	return (
		<MonthlyCalendar
			year={year}
			month={month}
			prev={ e => history.push(`/calendar/month/${prevMonth}`) }
			next={ e => history.push(`/calendar/month/${nextMonth}`) }
			events={events}
			weekStartsOn={1}
			DayHeader={DayHeader}
			onSlotClick={slot => console.debug(slot)}
			onEventClick={event => console.debug(event)}
		/>
	);
} ;

export default history => withTracker(({match}) => {

	const year = parseInt(match.params.year, 10);
	const month = parseInt(match.params.month, 10);

	const firstDayOfMonth = new Date(year, month-1, 1);
	const firstDayOfPrevMonth = subMonths(firstDayOfMonth, 1);
	const firstDayOfNextMonth = addMonths(firstDayOfMonth, 1);

	Meteor.subscribe('consultations');

	return {
		year,
		month,
		firstDayOfMonth,
		firstDayOfNextMonth,
		firstDayOfPrevMonth,
		history,
		consultations: Consultations.find({ datetime : { $gte : firstDayOfMonth , $lt : firstDayOfNextMonth } }, {sort: {datetime: 1}}).fetch() ,
	} ;

}) ( withStyles(styles, { withTheme: true })(MonthlyPlanner) );
