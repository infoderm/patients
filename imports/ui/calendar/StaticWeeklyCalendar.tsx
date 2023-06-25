import React from 'react';

import type PropsOf from '../../lib/types/PropsOf';

import CalendarHeader from './CalendarHeader';
import WeeklyCalendarData from './WeeklyCalendarData';

type Props = {
	className?: string;
	title?: string;
	next: () => void;
	prev: () => void;
	monthly: () => void;
	actions?: React.ReactNode[];
	navigationRole?: 'button' | 'link';
} & PropsOf<typeof WeeklyCalendarData>;

const StaticWeeklyCalendar = ({
	className,
	navigationRole,
	next,
	prev,
	monthly,
	year,
	week,
	actions,
	...rest
}: Props) => {
	const title = rest.title ?? `/calendar/week/${year}/${week}`;

	return (
		<div className={className}>
			<CalendarHeader
				title={title}
				navigationRole={navigationRole}
				prev={prev}
				next={next}
				monthly={monthly}
				actions={actions}
			/>
			<WeeklyCalendarData year={year} week={week} {...rest} />
		</div>
	);
};

export default StaticWeeklyCalendar;
