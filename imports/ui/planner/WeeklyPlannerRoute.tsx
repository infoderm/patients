import React from 'react';
import {useParams} from 'react-router-dom';
import PropsOf from '../../util/PropsOf';
import WeeklyPlanner from './WeeklyPlanner';

interface Params {
	year?: string;
	week?: string;
}

type Props = Omit<PropsOf<typeof WeeklyPlanner>, keyof Params>;

const WeeklyPlannerRoute = (props: Props) => {
	const {year, week} = useParams<Params>();
	return (
		<WeeklyPlanner
			year={Number.parseInt(year, 10)}
			week={Number.parseInt(week, 10)}
			{...props}
		/>
	);
};

export default WeeklyPlannerRoute;
