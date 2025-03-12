import React from 'react';

import type PropsOf from '../../util/types/PropsOf';

import CalendarHeader from './CalendarHeader';
import MonthlyCalendarData from './MonthlyCalendarData';

type Props = {
	readonly className?: string;
	readonly title?: string;
	readonly next: () => void;
	readonly prev: () => void;
	readonly weekly: () => void;
	readonly navigationRole?: 'button' | 'link';
} & PropsOf<typeof MonthlyCalendarData>;

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
