import React from 'react';

import type PropsOf from '../../util/PropsOf';

import {weekly} from './ranges';
import CalendarData from './CalendarData';

type Props = {
	year: number;
	week: number;
	weekOptions: {};
	maxLines?: number;
} & Omit<PropsOf<typeof CalendarData>, 'maxLines' | 'begin' | 'end'>;

const WeeklyCalendarData = ({
	year,
	week,
	weekOptions,
	maxLines = 24,
	...rest
}: Props) => {
	const [begin, end] = weekly(year, week, weekOptions);

	return (
		<CalendarData
			begin={begin}
			end={end}
			weekOptions={weekOptions}
			maxLines={maxLines}
			{...rest}
		/>
	);
};

export default WeeklyCalendarData;
