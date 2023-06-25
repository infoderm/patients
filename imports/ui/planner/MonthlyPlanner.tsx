import React from 'react';

import type PropsOf from '../../lib/types/PropsOf';
import ReactiveMonthlyCalendar from '../calendar/ReactiveMonthlyCalendar';

import Planner from './Planner';

type Props = PropsOf<typeof ReactiveMonthlyCalendar>;

const MonthlyPlanner = (props: Props) => (
	<Planner Calendar={ReactiveMonthlyCalendar} CalendarProps={props} />
);

export default MonthlyPlanner;
