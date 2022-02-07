import React from 'react';

import {useParams} from 'react-router-dom';

import {myDecodeURIComponent} from '../../util/uri';

import branch, {BranchProps} from './branch';

type Params = {
	year: string;
	book: string;
};

const ByBookRoute = <C extends React.ElementType>({
	component: Component,
	props,
}: BranchProps<C>) => {
	const params = useParams<Params>();
	const year = params.year;
	const book = myDecodeURIComponent(params.book);
	return <Component year={year} book={book} {...props} />;
};

const byBook = branch([':year/:book/*'], ByBookRoute);

export default byBook;
