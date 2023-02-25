import React from 'react';

import {useParams} from 'react-router-dom';

import {myDecodeURIComponent} from '../../lib/uri';

import branch, {type BranchProps} from './branch';

type Params = {
	payment_method?: string;
};

const ByPaymentMethodRoute = <C extends React.ElementType>({
	component: Component,
	props,
}: BranchProps<C>) => {
	const params = useParams<Params>();
	const payment_method = myDecodeURIComponent(params.payment_method);
	return <Component payment_method={payment_method} {...props} />;
};

const byPaymentMethod = branch(
	['*', 'payment_method/:payment_method/*'],
	ByPaymentMethodRoute,
);

export default byPaymentMethod;
