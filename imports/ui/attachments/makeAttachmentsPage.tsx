import React, {type DependencyList} from 'react';

import type PropsOf from '../../util/types/PropsOf';

import {type Sort} from '../../api/query/sort';
import type UserFilter from '../../api/query/UserFilter';
import type UserQuery from '../../api/query/UserQuery';

import {type AttachmentDocument} from '../../api/collection/attachments';

import PagedAttachmentsList from './PagedAttachmentsList';

type Props = {
	readonly url?: string;
	readonly page?: number;
	readonly perpage?: number;

	readonly filter?: UserFilter<AttachmentDocument>;
	readonly sort: Sort<AttachmentDocument>;
} & Omit<PropsOf<typeof PagedAttachmentsList>, 'page' | 'perpage' | 'items'>;

type Hook<T> = (
	query: UserQuery<T>,
	deps: DependencyList,
) => {loading: boolean; results: T[]};

const makeAttachmentsPage =
	(useUploads: Hook<AttachmentDocument>) =>
	({filter = {}, sort, page = 1, perpage = 10, url, ...rest}: Props) => {
		const query = {
			filter,
			sort,
			skip: (page - 1) * perpage,
			limit: perpage,
		};

		const deps = [JSON.stringify(query)];

		const {loading, results: items} = useUploads(query, deps);

		return (
			<PagedAttachmentsList
				loading={loading}
				page={page}
				perpage={perpage}
				items={items}
				{...rest}
			/>
		);
	};

export default makeAttachmentsPage;
