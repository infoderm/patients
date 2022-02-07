import React from 'react';

import {useParams} from 'react-router-dom';

import {parseNonNegativeIntegerStrictOrUndefined} from '../../api/string';

import branch, {BranchProps} from './branch';

type Params = {
	page?: string;
};

const PagedRoute = <C extends React.ElementType>({
	component: Component,
	props,
}: BranchProps<C>) => {
	const params = useParams<Params>();
	const page = parseNonNegativeIntegerStrictOrUndefined(params.page);
	return <Component page={page} {...props} />;
};

const paged = branch(['*', 'page/:page/*'], PagedRoute);

export default paged;