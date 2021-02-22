import React from 'react';
import PropTypes from 'prop-types';

import CalendarHeader from './CalendarHeader.js';
import MonthlyCalendarData from './MonthlyCalendarData.js';

const StaticMonthlyCalendar = (props) => {
	const {
		className,
		events,
		next,
		prev,
		weekly,
		year,
		month,
		weekOptions,
		DayHeader,
		onSlotClick,
		onEventClick,
		...rest
	} = props;

	const title = props.title ?? `/calendar/month/${year}/${month}`;

	return (
		<div className={className}>
			<CalendarHeader title={title} prev={prev} next={next} weekly={weekly} />
			<MonthlyCalendarData
				year={year}
				month={month}
				events={events}
				weekOptions={weekOptions}
				DayHeader={DayHeader}
				onSlotClick={onSlotClick}
				onEventClick={onEventClick}
				{...rest}
			/>
		</div>
	);
};

StaticMonthlyCalendar.propTypes = {
	title: PropTypes.string,
	year: PropTypes.number.isRequired,
	month: PropTypes.number.isRequired,
	events: PropTypes.array.isRequired,
	next: PropTypes.func,
	prev: PropTypes.func,
	weekly: PropTypes.func,
	weekOptions: PropTypes.object
};

export default StaticMonthlyCalendar;
