import React from 'react';

import type PropsOf from '../../util/types/PropsOf';

import CalendarHeader from './CalendarHeader';
import WeeklyCalendarData from './WeeklyCalendarData';

type Props = {
	readonly className?: string;
	readonly title?: string;
	readonly next: () => void;
	readonly prev: () => void;
	readonly monthly: () => void;
	readonly actions?: React.ReactNode[];
	readonly navigationRole?: 'button' | 'link';
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
