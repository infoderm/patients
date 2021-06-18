import React from 'react';
import WeeklyPlanner from './WeeklyPlanner';

const PreconfiguredWeeklyPlanner = (props) => (
	<WeeklyPlanner
		CalendarProps={{
			skipIdle: true,
			maxLines: 40,
			minEventDuration: 15 * 60 * 1000,
			dayBegins: '10:00'
		}}
		{...props}
	/>
);

export default PreconfiguredWeeklyPlanner;
