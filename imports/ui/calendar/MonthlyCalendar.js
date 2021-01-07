import React from 'react';
import PropTypes from 'prop-types';

import CalendarHeader from './CalendarHeader.js';
import MonthlyCalendarData from './MonthlyCalendarData.js';

const MonthlyCalendar = (props) => {
	const {
		events,
		next,
		prev,
		weekly,
		year,
		month,
		weekOptions,
		DayHeader,
		onSlotClick,
		onEventClick
	} = props;

	return (
		<div>
			<CalendarHeader prev={prev} next={next} weekly={weekly} />
			<MonthlyCalendarData
				year={year}
				month={month}
				events={events}
				weekOptions={weekOptions}
				DayHeader={DayHeader}
				onSlotClick={onSlotClick}
				onEventClick={onEventClick}
			/>
		</div>
	);
};

MonthlyCalendar.propTypes = {
	year: PropTypes.number.isRequired,
	month: PropTypes.number.isRequired,
	events: PropTypes.array.isRequired,
	next: PropTypes.func,
	prev: PropTypes.func,
	weekly: PropTypes.func,
	weekOptions: PropTypes.object
};

export default MonthlyCalendar;
