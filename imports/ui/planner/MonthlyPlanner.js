import React from 'react';
import ReactiveMonthlyCalendar from '../calendar/ReactiveMonthlyCalendar';
import Planner from './Planner';

const MonthlyPlanner = (props) => (
	<Planner Calendar={ReactiveMonthlyCalendar} {...props} />
);

export default MonthlyPlanner;
