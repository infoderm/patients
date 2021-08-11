import React from 'react';
import PropTypes from 'prop-types';

import CalendarHeader from './CalendarHeader';
import WeeklyCalendarData from './WeeklyCalendarData';

const StaticWeeklyCalendar = (props) => {
	const {
		className,
		events,
		next,
		prev,
		monthly,
		year,
		week,
		weekOptions,
		DayHeader,
		onSlotClick,
		onEventClick,
		...rest
	} = props;

	const title = props.title ?? `/calendar/week/${year}/${week}`;

	return (
		<div className={className}>
			<CalendarHeader title={title} prev={prev} next={next} monthly={monthly} />
			<WeeklyCalendarData
				year={year}
				week={week}
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

StaticWeeklyCalendar.propTypes = {
	className: PropTypes.string,
	title: PropTypes.string,
	year: PropTypes.number.isRequired,
	week: PropTypes.number.isRequired,
	events: PropTypes.array.isRequired,
	DayHeader: PropTypes.elementType.isRequired,
	next: PropTypes.func,
	prev: PropTypes.func,
	monthly: PropTypes.func,
	weekOptions: PropTypes.object,
};

export default StaticWeeklyCalendar;
