import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';

import React from 'react';

import {Link, useHistory} from 'react-router-dom';

import isSameDay from 'date-fns/isSameDay';
import startOfMonth from 'date-fns/startOfMonth';
import dateFormat from 'date-fns/format';
import addMonths from 'date-fns/addMonths';
import subMonths from 'date-fns/subMonths';

import {Events} from '../../api/events.js';

import StaticMonthlyCalendar from './StaticMonthlyCalendar.js';
import {monthly} from './ranges.js';

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

const WeekNumber = ({className, day, weekOptions}) => {
	return (
		<div className={className}>
			<Link to={`/calendar/week/${dateFormat(day, 'yyyy/ww', weekOptions)}`}>
				{dateFormat(day, 'w', weekOptions)}
			</Link>
		</div>
	);
};

const ReactiveMonthlyCalendar = (props) => {
	const {
		className,
		title,
		year,
		month,
		weekOptions,
		firstDayOfMonth,
		firstDayOfNextMonth,
		firstDayOfPrevMonth,
		displayedWeekDays,
		showCancelledEvents,
		onSlotClick,
		events
	} = props;

	const history = useHistory();

	const previousMonth = dateFormat(firstDayOfPrevMonth, 'yyyy/MM');
	const nextMonth = dateFormat(firstDayOfNextMonth, 'yyyy/MM');
	const firstWeekOfMonth = dateFormat(firstDayOfMonth, 'yyyy/ww');

	const displayedEvents = events.filter(
		(x) => showCancelledEvents || !x.isCancelled
	);

	return (
		<StaticMonthlyCalendar
			className={className}
			title={title}
			year={year}
			month={month}
			prev={() => history.push(`/calendar/month/${previousMonth}`)}
			next={() => history.push(`/calendar/month/${nextMonth}`)}
			weekly={() => history.push(`/calendar/week/${firstWeekOfMonth}`)}
			events={displayedEvents}
			DayHeader={DayHeader}
			WeekNumber={WeekNumber}
			weekOptions={weekOptions}
			displayedWeekDays={displayedWeekDays}
			onSlotClick={onSlotClick}
		/>
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

	const title = dateFormat(firstDayOfMonth, 'yyyy MMMM');

	Meteor.subscribe('events.interval', begin, end);

	return {
		title,
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
})(ReactiveMonthlyCalendar);
