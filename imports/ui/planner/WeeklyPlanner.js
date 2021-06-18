import React from 'react';
import ReactiveWeeklyCalendar from '../calendar/ReactiveWeeklyCalendar';
import Planner from './Planner';

const WeeklyPlanner = (props) => (
	<Planner Calendar={ReactiveWeeklyCalendar} {...props} />
);

export default WeeklyPlanner;
