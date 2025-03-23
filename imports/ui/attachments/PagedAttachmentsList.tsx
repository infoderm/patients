import React from 'react';

import type PropsOf from '../../util/types/PropsOf';

import Loading from '../navigation/Loading';
import Paginator from '../navigation/Paginator';
import Refresh from '../navigation/Refresh';
import NoContent from '../navigation/NoContent';

import {type AttachmentDocument} from '../../api/collection/attachments';

import AttachmentsGrid from './AttachmentsGrid';

type PagedAttachmentsListProps = {
	readonly page: number;
	readonly perpage: number;
	readonly items: AttachmentDocument[];
	readonly loading?: boolean;
	readonly dirty?: boolean;
	readonly refresh?: () => void;
	readonly LoadingIndicator?: React.ElementType<{}>;
	readonly EmptyPage?: React.ElementType<{page: number}>;
} & Omit<PropsOf<typeof AttachmentsGrid>, 'attachments'>;

const DefaultLoadingIndicator = Loading;
const DefaultEmptyPage = ({page}: {readonly page: number}) => (
	<NoContent>{`Nothing to see on page ${page}.`}</NoContent>
);

const PagedAttachmentsList = ({
	loading = false,
	page,
	perpage,
	items,
	refresh = undefined,
	dirty = false,
	LoadingIndicator = DefaultLoadingIndicator,
	EmptyPage = DefaultEmptyPage,
	...rest
}: PagedAttachmentsListProps) => (
	<div>
		{loading && items.length === 0 ? (
			<LoadingIndicator />
		) : items.length > 0 ? (
			<AttachmentsGrid loading={loading} attachments={items} {...rest} />
		) : (
			<EmptyPage page={page} />
		)}
		<Paginator loading={loading} end={items.length < perpage} />
		{refresh && dirty && <Refresh onClick={refresh} />}
	</div>
);

export default PagedAttachmentsList;
