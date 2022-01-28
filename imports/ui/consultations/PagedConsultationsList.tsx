import React from 'react';

import PropsOf from '../../util/PropsOf';

import Loading from '../navigation/Loading';
import Paginator from '../navigation/Paginator';
import Refresh from '../navigation/Refresh';
import NoContent from '../navigation/NoContent';

import ConsultationsList from './ConsultationsList';

interface PagedConsultationsListProps
	extends PropsOf<typeof ConsultationsList> {
	root: string;
	page: number;
	perpage: number;
	items: any[];
	loading?: boolean;
	dirty?: boolean;
	refresh?: () => void;
}

const PagedConsultationsList = ({
	root,
	loading = false,
	page,
	perpage,
	items,
	refresh = undefined,
	dirty = false,
	...rest
}: PagedConsultationsListProps) => (
	<div>
		{loading && items.length === 0 ? (
			<Loading />
		) : items.length > 0 ? (
			<ConsultationsList loading={loading} items={items} {...rest} />
		) : (
			<NoContent>{`Nothing to see on page ${page}.`}</NoContent>
		)}
		<Paginator page={page} end={items.length < perpage} root={root} />
		{refresh && dirty && <Refresh onClick={refresh} />}
	</div>
);

export default PagedConsultationsList;
