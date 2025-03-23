import React from 'react';

import {useParams} from 'react-router-dom';

import {parseNonNegativeIntegerStrictOrUndefined} from '../../api/string';
import type PropsOf from '../../util/types/PropsOf';

import branch, {type BranchProps} from './branch';

type Params = {
	page?: string;
};

const PagedRoute = <C extends React.ElementType>({
	component: Component,
	props,
}: BranchProps<C>) => {
	const params = useParams<Params>();
	const page =
		params.page === undefined
			? 1
			: parseNonNegativeIntegerStrictOrUndefined(params.page);
	return <Component page={page} {...props} />;
};

const paged = branch(['*', 'page/:page/*'], PagedRoute) as <
	C extends React.ElementType,
>(
	component: C,
) => (props: PropsOf<C>) => React.ReactElement;

export default paged;
