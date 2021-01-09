import React from 'react';
import PropTypes from 'prop-types';

import CalendarHeader from './CalendarHeader.js';
import WeeklyCalendarData from './WeeklyCalendarData.js';

const WeeklyCalendar = (props) => {
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

	return (
		<div className={className}>
			<CalendarHeader prev={prev} next={next} monthly={monthly} />
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

WeeklyCalendar.propTypes = {
	year: PropTypes.number.isRequired,
	week: PropTypes.number.isRequired,
	events: PropTypes.array.isRequired,
	next: PropTypes.func,
	prev: PropTypes.func,
	monthly: PropTypes.func,
	weekOptions: PropTypes.object
};

export default WeeklyCalendar;
