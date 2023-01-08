import React from 'react';

import {useParams} from 'react-router-dom';

import startOfToday from 'date-fns/startOfToday';

import {useDateFormat} from '../../i18n/datetime';

import branch, {type BranchProps} from './branch';

type Params = {
	year?: string;
	month?: string;
};

const ByMonthRoute = <C extends React.ElementType>({
	component: Component,
	props,
}: BranchProps<C>) => {
	const dateFormat = useDateFormat();
	const today = startOfToday();
	const params = useParams<Params>();
	const year = Number.parseInt(params.year ?? dateFormat(today, 'yyyy'), 10);
	const month = Number.parseInt(params.month ?? dateFormat(today, 'MM'), 10);
	return <Component year={year} month={month} {...props} />;
};

const byMonth = branch(['current/*', ':year/:month/*'], ByMonthRoute);

export default byMonth;
