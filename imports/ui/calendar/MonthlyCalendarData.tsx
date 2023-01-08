import React from 'react';

import type PropsOf from '../../util/PropsOf';

import {monthly} from './ranges';
import CalendarData from './CalendarData';

type Props = {
	year: number;
	month: number;
	weekOptions: {};
	maxLines?: number;
} & Omit<PropsOf<typeof CalendarData>, 'maxLines' | 'begin' | 'end'>;

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
