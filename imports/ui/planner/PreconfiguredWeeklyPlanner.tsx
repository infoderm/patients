import React from 'react';

import type PropsOf from '../../util/types/PropsOf';

import WeeklyPlanner from './WeeklyPlanner';

type Props = PropsOf<typeof WeeklyPlanner>;

const PreconfiguredWeeklyPlanner = (props: Props) => {
	const minEventDurationMinutes = 15;
	const maxLines = (24 * 60) / minEventDurationMinutes;
	return (
		<WeeklyPlanner
			skipIdle
			maxLines={maxLines + 2}
			maxHeight="calc(100vh - 285px)"
			minEventDuration={minEventDurationMinutes * 60 * 1000}
			dayBegins="00:00"
			{...props}
		/>
	);
};

export default PreconfiguredWeeklyPlanner;
