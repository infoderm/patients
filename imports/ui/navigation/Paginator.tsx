import React, {useEffect, useState} from 'react';

import {useParams} from 'react-router-dom';

import {parseNonNegativeIntegerStrictOrUndefined} from '../../api/string';

import Prev from './Prev';
import Next from './Next';

type Props = {
	readonly root: string;
	readonly page?: number;
	readonly firstPage?: number;
	readonly end?: boolean;
	readonly disabled?: boolean;
	readonly loading?: boolean;
};

const PaginatorBase = ({
	root,
	firstPage = 1,
	page = firstPage,
	end = false,
	disabled = false,
	loading = false,
}: Props) => {
	const isFirstPage = page === firstPage;
	const isOnlyPage = isFirstPage && end;
	const [hide, setHide] = useState(loading);

	useEffect(() => {
		if (!loading) {
			setHide(isOnlyPage);
		}
	}, [loading, isOnlyPage]);

	const prevPage = page - 1;
	const nextPage = page + 1;
	const prevDisabled = disabled || isFirstPage;
	const nextDisabled = disabled || (!loading && end);

	return (
		<>
			<Prev
				visible={!hide}
				to={`${root}${prevPage}`}
				disabled={prevDisabled}
				aria-label={prevDisabled ? undefined : `Page ${prevPage}`}
			/>
			<Next
				visible={!hide}
				to={`${root}${nextPage}`}
				disabled={nextDisabled}
				aria-label={nextDisabled ? undefined : `Page ${nextPage}`}
			/>
		</>
	);
};

type Params = {page?: string};

const Paginator = (props: Omit<Props, 'page' | 'root'>) => {
	const params = useParams<Params>();
	const page =
		params.page === undefined
			? undefined
			: parseNonNegativeIntegerStrictOrUndefined(params.page);
	const root = `${page === undefined ? '' : '../'}page/`;
	return <PaginatorBase page={page} root={root} {...props} />;
};

export default Paginator;
