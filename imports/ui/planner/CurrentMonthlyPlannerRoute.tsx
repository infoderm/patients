import startOfToday from 'date-fns/startOfToday';
import React from 'react';
import {useDateFormat} from '../../i18n/datetime';
import MonthlyPlanner from './MonthlyPlanner';

const CurrentMonthlyPlannerRoute = () => {
	const dateFormat = useDateFormat();
	const today = startOfToday();
	const year = dateFormat(today, 'yyyy');
	const month = dateFormat(today, 'MM');
	return (
		<MonthlyPlanner
			year={Number.parseInt(year, 10)}
			month={Number.parseInt(month, 10)}
		/>
	);
};

export default CurrentMonthlyPlannerRoute;
