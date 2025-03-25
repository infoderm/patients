import React from 'react';

import type PropsOf from '../../util/types/PropsOf';

import Loading from '../navigation/Loading';
import Paginator from '../navigation/Paginator';
import Refresh from '../navigation/Refresh';
import NoContent from '../navigation/NoContent';

import ConsultationsList from './ConsultationsList';

type PagedConsultationsListProps = {
	readonly page: number;
	readonly perpage: number;
	readonly items: any[];
	readonly loading?: boolean;
	readonly dirty?: boolean;
	readonly refresh?: () => void;
	readonly LoadingIndicator?: React.ElementType<{}>;
	readonly EmptyPage?: React.ElementType<{page: number}>;
} & PropsOf<typeof ConsultationsList>;

const DefaultLoadingIndicator = Loading;
const DefaultEmptyPage = ({page}: {readonly page: number}) => (
	<NoContent>{`Nothing to see on page ${page}.`}</NoContent>
);

const PagedConsultationsList = ({
	loading = false,
	page,
	perpage,
	items,
	refresh = undefined,
	dirty = false,
	LoadingIndicator = DefaultLoadingIndicator,
	EmptyPage = DefaultEmptyPage,
	...rest
}: PagedConsultationsListProps) => (
	<div>
		{loading && items.length === 0 ? (
			<LoadingIndicator />
		) : items.length > 0 ? (
			<ConsultationsList loading={loading} items={items} {...rest} />
		) : (
			<EmptyPage page={page} />
		)}
		<Paginator loading={loading} end={items.length < perpage} />
		{refresh && dirty && <Refresh onClick={refresh} />}
	</div>
);

export default PagedConsultationsList;
