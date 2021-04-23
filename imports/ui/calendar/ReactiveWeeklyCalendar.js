import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';

import React from 'react';

import {Link, useHistory} from 'react-router-dom';

import isSameDay from 'date-fns/isSameDay';
import startOfWeek from 'date-fns/startOfWeek';
import dateFormat from 'date-fns/format';
import addWeeks from 'date-fns/addWeeks';
import subWeeks from 'date-fns/subWeeks';
import isFirstDayOfMonth from 'date-fns/isFirstDayOfMonth';

import {Events} from '../../api/events.js';

import StaticWeeklyCalendar from './StaticWeeklyCalendar.js';
import {weekly} from './ranges.js';

const DayHeader = ({className, day, weekOptions}) => {
	const firstDayOfWeek = startOfWeek(day, weekOptions);
	const displayFormat =
		isFirstDayOfMonth(day) || isSameDay(day, firstDayOfWeek) ? 'MMM d' : 'd';
	return (
		<div className={className}>
			<Link to={`/calendar/day/${dateFormat(day, 'yyyy-MM-dd')}`}>
				{dateFormat(day, displayFormat)}
			</Link>
		</div>
	);
};

const ReactiveWeeklyCalendar = (props) => {
	const {
		className,
		title,
		year,
		week,
		weekOptions,
		nextWeek,
		prevWeek,
		monthOfWeek,
		displayedWeekDays,
		showCancelledEvents,
		onSlotClick,
		events,
		...rest
	} = props;

	const history = useHistory();

	const displayedEvents = events.filter(
		(x) => showCancelledEvents || !x.isCancelled
	);

	return (
		<StaticWeeklyCalendar
			className={className}
			title={title}
			year={year}
			week={week}
			prev={() => history.push(`/calendar/week/${prevWeek}`)}
			next={() => history.push(`/calendar/week/${nextWeek}`)}
			monthly={() => history.push(`/calendar/month/${monthOfWeek}`)}
			events={displayedEvents}
			DayHeader={DayHeader}
			weekOptions={weekOptions}
			displayedWeekDays={displayedWeekDays}
			onSlotClick={onSlotClick}
			{...rest}
		/>
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

	const [begin, end] = weekly(year, week, weekOptions);

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

	const title = dateFormat(someDayOfWeek, "yyyy MMMM / 'Week' w", weekOptions);

	Meteor.subscribe('events.interval', begin, end);

	return {
		title,
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
})(ReactiveWeeklyCalendar);
