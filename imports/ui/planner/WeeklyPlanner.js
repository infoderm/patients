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
import calendarRanges from '../calendar/ranges.js';

import NewAppointmentDialog from '../appointments/NewAppointmentDialog.js';

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

class MonthlyPlanner extends React.Component {

	constructor ( props ) {
		super(props);
		this.state = {
			selectedSlot: new Date(),
			creatingAppointment: false,
		} ;
	}

	onSlotClick = slot => {
		console.debug(slot);
		this.setState({
			selectedSlot: slot ,
			creatingAppointment: true ,
		});
	}

	onEventClick = event => {
		console.debug(event);
	}

	render ( ) {

		const {
			history,
			year,
			month,
			weekOptions,
			firstDayOfMonth,
			firstDayOfNextMonth,
			firstDayOfPrevMonth,
			consultations,
		} = this.props ;

		const {
			creatingAppointment,
			selectedSlot,
		} = this.state ;

		const prevMonth = dateFormat(firstDayOfPrevMonth, 'YYYY/MM');
		const nextMonth = dateFormat(firstDayOfNextMonth, 'YYYY/MM');
		const firstWeekOfMonth = dateFormat(firstDayOfMonth, 'YYYY/WW');

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
					onSlotClick={this.onSlotClick}
					onEventClick={this.onEventClick}
					{...weekOptions}
				/>
				<NewAppointmentDialog
					initialDatetime={selectedSlot}
					open={creatingAppointment}
					onClose={e => this.setState({creatingAppointment: false})}
				/>
			</div>
		);

	}

} ;

export default history => withTracker(({match}) => {

	const year = parseInt(match.params.year, 10);
	const week = parseInt(match.params.week, 10);

	const weekOptions = {
		weekStartsOn: 1,
	};

	const [begin, end] = calendarRanges.weekly(year, week, weekOptions);

	console.debug(begin, end);

	const firstDayOfMonth = new Date(year, week-1, 1);
	const firstDayOfPrevMonth = subMonths(firstDayOfMonth, 1);
	const firstDayOfNextMonth = addMonths(firstDayOfMonth, 1);

	Meteor.subscribe('consultationsAndAppointments');

	return {
		year,
		month: week,
		week,
		weekOptions,
		firstDayOfMonth,
		firstDayOfNextMonth,
		firstDayOfPrevMonth,
		history,
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

}) ( withStyles(styles, { withTheme: true })(MonthlyPlanner) );
