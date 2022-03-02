import React from 'react';

import PropsOf from '../../util/PropsOf';
import CalendarHeader from './CalendarHeader';
import WeeklyCalendarData from './WeeklyCalendarData';

interface Props extends PropsOf<typeof WeeklyCalendarData> {
	className?: string;
	title?: string;
	next: () => void;
	prev: () => void;
	monthly: () => void;
	actions?: React.ReactNode[];
	navigationRole?: 'button' | 'link';
}

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
