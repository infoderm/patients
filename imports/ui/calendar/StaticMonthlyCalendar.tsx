import React from 'react';

import PropsOf from '../../util/PropsOf';
import CalendarHeader from './CalendarHeader';
import MonthlyCalendarData from './MonthlyCalendarData';

interface Props extends PropsOf<typeof MonthlyCalendarData> {
	className?: string;
	title?: string;
	next: () => void;
	prev: () => void;
	weekly: () => void;
	navigationRole?: 'button' | 'link';
}

const StaticMonthlyCalendar = ({
	className,
	navigationRole,
	next,
	prev,
	weekly,
	year,
	month,
	...rest
}: Props) => {
	const title = rest.title ?? `/calendar/month/${year}/${month}`;

	return (
		<div className={className}>
			<CalendarHeader
				title={title}
				navigationRole={navigationRole}
				prev={prev}
				next={next}
				weekly={weekly}
			/>
			<MonthlyCalendarData year={year} month={month} {...rest} />
		</div>
	);
};

export default StaticMonthlyCalendar;
