import React from 'react';
import WeeklyPlanner from './WeeklyPlanner.js';

const PreconfiguredWeeklyPlanner = (props) => (
	<WeeklyPlanner
		CalendarProps={{
			skipIdle: true,
			maxLines: 40
		}}
		{...props}
	/>
);

export default PreconfiguredWeeklyPlanner;
