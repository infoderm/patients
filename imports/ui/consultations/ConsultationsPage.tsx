import React from 'react';

import {type ConsultationDocument} from '../../api/collection/consultations';
import type UserFilter from '../../api/query/UserFilter';
import type PropsOf from '../../lib/types/PropsOf';

import PagedConsultationsList from './PagedConsultationsList';
import useConsultationsAndAppointments from './useConsultationsAndAppointments';

type Props = {
	readonly url?: string;
	readonly page?: number;
	readonly perpage?: number;

	readonly filter?: UserFilter<ConsultationDocument>;
	readonly sort: object;
	readonly defaultExpandedFirst?: boolean;
} & Omit<PropsOf<typeof PagedConsultationsList>, 'page' | 'perpage' | 'items'>;

const ConsultationsPage = ({
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

	const {loading, results: items} = useConsultationsAndAppointments(
		query,
		deps,
	);

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

export default ConsultationsPage;
