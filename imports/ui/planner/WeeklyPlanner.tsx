import React from 'react';

import type PropsOf from '../../util/types/PropsOf';
import ReactiveWeeklyCalendar from '../calendar/ReactiveWeeklyCalendar';

import Planner from './Planner';

type Props = PropsOf<typeof ReactiveWeeklyCalendar>;

const WeeklyPlanner = (props: Props) => (
	<Planner Calendar={ReactiveWeeklyCalendar} CalendarProps={props} />
);

export default WeeklyPlanner;
