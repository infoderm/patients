import React from 'react';

import {useParams} from 'react-router-dom';

import startOfToday from 'date-fns/startOfToday';

import {useWeekYearFormat} from '../../i18n/datetime';

import branch, {BranchProps} from './branch';

type Params = {
	year?: string;
	week?: string;
};

const ByWeekRoute = <C extends React.ElementType>({
	component: Component,
	props,
}: BranchProps<C>) => {
	const {yearFormat, weekFormat} = useWeekYearFormat();
	const today = startOfToday();
	const params = useParams<Params>();
	const year = Number.parseInt(params.year ?? yearFormat(today), 10);
	const week = Number.parseInt(params.week ?? weekFormat(today), 10);
	return <Component year={year} week={week} {...props} />;
};

const byWeek = branch(['current/*', ':year/:week/*'], ByWeekRoute);

export default byWeek;
