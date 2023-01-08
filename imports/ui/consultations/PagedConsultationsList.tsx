import React from 'react';

import type PropsOf from '../../util/PropsOf';

import Loading from '../navigation/Loading';
import Paginator from '../navigation/Paginator';
import Refresh from '../navigation/Refresh';
import NoContent from '../navigation/NoContent';

import ConsultationsList from './ConsultationsList';

type PagedConsultationsListProps = {
	page: number;
	perpage: number;
	items: any[];
	loading?: boolean;
	dirty?: boolean;
	refresh?: () => void;
} & PropsOf<typeof ConsultationsList>;

const PagedConsultationsList = ({
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
		<Paginator loading={loading} end={items.length < perpage} />
		{refresh && dirty && <Refresh onClick={refresh} />}
	</div>
);

export default PagedConsultationsList;
