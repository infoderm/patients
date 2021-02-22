import React from 'react';
import ReactiveMonthlyCalendar from '../calendar/ReactiveMonthlyCalendar.js';
import Planner from './Planner.js';

const MonthlyPlanner = (props) => (
	<Planner Calendar={ReactiveMonthlyCalendar} {...props} />
);

export default MonthlyPlanner;
