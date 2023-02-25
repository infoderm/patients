import React from 'react';
import type PropsOf from '../../lib/types/PropsOf';
import WeeklyPlanner from './WeeklyPlanner';

type Props = PropsOf<typeof WeeklyPlanner>;

const PreconfiguredWeeklyPlanner = (props: Props) => {
	return (
		<WeeklyPlanner
			skipIdle
			maxLines={40}
			minEventDuration={15 * 60 * 1000}
			dayBegins="10:00"
			{...props}
		/>
	);
};

export default PreconfiguredWeeklyPlanner;
