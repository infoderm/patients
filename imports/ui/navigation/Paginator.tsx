import React, {useEffect, useState} from 'react';

import {useParams} from 'react-router-dom';
import {parseNonNegativeIntegerStrictOrUndefined} from '../../api/string';
import Prev from './Prev';
import Next from './Next';

interface Props {
	root: string;
	page?: number;
	firstPage?: number;
	end?: boolean;
	disabled?: boolean;
	loading?: boolean;
}

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
	const [hide, setHide] = useState(loading && isOnlyPage);

	useEffect(() => {
		if (!loading) {
			setHide(isOnlyPage);
		}
	}, [loading, isOnlyPage]);

	if (hide) {
		return null;
	}

	return (
		<>
			<Prev to={`${root}${page - 1}`} disabled={disabled || isFirstPage} />
			<Next
				to={`${root}${page + 1}`}
				disabled={disabled || (!loading && end)}
			/>
		</>
	);
};

type Params = {page?: string};

const Paginator = (props: Omit<Props, 'page' | 'root'>) => {
	const params = useParams<Params>();
	const page = parseNonNegativeIntegerStrictOrUndefined(params.page);
	const root = `${page === undefined ? '' : '../'}page/`;
	return <PaginatorBase page={page} root={root} {...props} />;
};

export default Paginator;
