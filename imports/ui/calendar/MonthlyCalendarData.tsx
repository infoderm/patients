import React from 'react';

import PropsOf from '../../util/PropsOf';

import {monthly} from './ranges';
import CalendarData from './CalendarData';

interface Props
	extends Omit<PropsOf<typeof CalendarData>, 'maxLines' | 'begin' | 'end'> {
	year: number;
	month: number;
	weekOptions: {};
	maxLines?: number;
}

const MonthlyCalendarData = ({
	year,
	month,
	weekOptions,
	maxLines = 6,
	...rest
}: Props) => {
	const [begin, end] = monthly(year, month, weekOptions);

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

export default MonthlyCalendarData;
