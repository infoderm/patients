import React from 'react';
import {useParams} from 'react-router-dom';
import PropsOf from '../../util/PropsOf';
import MonthlyPlanner from './MonthlyPlanner';

interface Params {
	year?: string;
	month?: string;
}

type Props = Omit<PropsOf<typeof MonthlyPlanner>, keyof Params>;

const MonthlyPlannerRoute = (props: Props) => {
	const {year, month} = useParams<Params>();
	return (
		<MonthlyPlanner
			year={Number.parseInt(year, 10)}
			month={Number.parseInt(month, 10)}
			{...props}
		/>
	);
};

export default MonthlyPlannerRoute;
