import React from 'react';
import {useParams} from 'react-router-dom';
import PropsOf from '../../util/PropsOf';
import PreconfiguredWeeklyPlanner from './PreconfiguredWeeklyPlanner';

interface Params {
	year?: string;
	week?: string;
}

type Props = Omit<PropsOf<typeof PreconfiguredWeeklyPlanner>, keyof Params>;

const WeeklyPlannerRoute = (props: Props) => {
	const {year, week} = useParams<Params>();
	return (
		<PreconfiguredWeeklyPlanner
			year={Number.parseInt(year, 10)}
			week={Number.parseInt(week, 10)}
			{...props}
		/>
	);
};

export default WeeklyPlannerRoute;
