import startOfToday from 'date-fns/startOfToday';
import React from 'react';
import {useDateFormat} from '../../i18n/datetime';
import PreconfiguredWeeklyPlanner from './PreconfiguredWeeklyPlanner';

const CurrentWeeklyPlannerRoute = () => {
	const dateFormat = useDateFormat();
	const today = startOfToday();
	const year = dateFormat(today, 'YYYY', {
		useAdditionalWeekYearTokens: true,
	});
	const week = dateFormat(today, 'ww');
	return (
		<PreconfiguredWeeklyPlanner
			year={Number.parseInt(year, 10)}
			week={Number.parseInt(week, 10)}
		/>
	);
};

export default CurrentWeeklyPlannerRoute;
