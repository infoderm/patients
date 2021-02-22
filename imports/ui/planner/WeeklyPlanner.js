import React from 'react';
import ReactiveWeeklyCalendar from '../calendar/ReactiveWeeklyCalendar.js';
import Planner from './Planner.js';

const WeeklyPlanner = (props) => (
	<Planner Calendar={ReactiveWeeklyCalendar} {...props} />
);

export default WeeklyPlanner;
