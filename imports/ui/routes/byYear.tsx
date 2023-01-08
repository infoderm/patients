import React from 'react';

import {useParams} from 'react-router-dom';

import dateFormat from 'date-fns/format';

import branch, {type BranchProps} from './branch';

type Params = {
	year?: string;
};

const ByYearRoute = <C extends React.ElementType>({
	component: Component,
	props,
}: BranchProps<C>) => {
	const params = useParams<Params>();
	const yearString = params.year ?? dateFormat(new Date(), 'yyyy');
	const year = Number.parseInt(yearString, 10);
	return <Component year={year} {...props} />;
};

const byYear = branch(['*', 'year/:year/*'], ByYearRoute);

export default byYear;
