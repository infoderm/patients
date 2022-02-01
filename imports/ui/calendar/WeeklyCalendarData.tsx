import React from 'react';

import PropsOf from '../../util/PropsOf';

import {weekly} from './ranges';
import CalendarData from './CalendarData';

interface Props
	extends Omit<PropsOf<typeof CalendarData>, 'maxLines' | 'begin' | 'end'> {
	year: number;
	week: number;
	weekOptions: {};
	maxLines?: number;
}

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
