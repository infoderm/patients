import React from 'react';

import type PropsOf from '../../util/types/PropsOf';

import type UserFilter from '../../api/query/UserFilter';
import {type Sort} from '../../api/query/sort';

import {type ConsultationDocument} from '../../api/collection/consultations';

import type GenericQueryHook from '../../api/GenericQueryHook';

import PagedConsultationsList from './PagedConsultationsList';

type Props = {
	readonly url?: string;
	readonly page?: number;
	readonly perpage?: number;

	readonly filter?: UserFilter<ConsultationDocument>;
	readonly sort: Sort<ConsultationDocument>;
	readonly defaultExpandedFirst?: boolean;
} & Omit<PropsOf<typeof PagedConsultationsList>, 'page' | 'perpage' | 'items'>;

const makeConsultationsPage =
	(useConsultations: GenericQueryHook<ConsultationDocument>) =>
	({
		filter = {},
		sort,
		page = 1,
		perpage = 10,
		url,
		defaultExpandedFirst = false,
		...rest
	}: Props) => {
		const query = {
			filter,
			sort,
			skip: (page - 1) * perpage,
			limit: perpage,
		};

		const deps = [JSON.stringify(query)];

		const {loading, results: items} = useConsultations(query, deps);

		return (
			<PagedConsultationsList
				loading={loading}
				page={page}
				perpage={perpage}
				items={items}
				defaultExpandedFirst={page === 1 && defaultExpandedFirst}
				{...rest}
			/>
		);
	};

export default makeConsultationsPage;
