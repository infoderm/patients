import React from 'react';

import {useParams} from 'react-router-dom';

import {myDecodeURIComponent} from '../../lib/uri';

import branch, {type BranchProps} from './branch';

type Params = {
	name: string;
};

const ByNameRoute = <C extends React.ElementType>({
	component: Component,
	props,
}: BranchProps<C>) => {
	const params = useParams<Params>();
	const name = myDecodeURIComponent(params.name);
	return <Component name={name} {...props} />;
};

const byName = branch([':name/*'], ByNameRoute);

export default byName;
