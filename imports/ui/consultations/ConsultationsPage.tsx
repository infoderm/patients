import React from 'react';
import PropsOf from '../../util/PropsOf';

import PagedConsultationsList from './PagedConsultationsList';
import useConsultationsAndAppointments from './useConsultationsAndAppointments';

interface Props
	extends Omit<
		PropsOf<typeof PagedConsultationsList>,
		'page' | 'perpage' | 'items'
	> {
	url?: string;
	page?: number;
	perpage?: number;

	query?: object;
	sort: object;
	defaultExpandedFirst?: boolean;
}

const ConsultationsPage = ({
	query = {},
	sort,
	page = 1,
	perpage = 10,
	url,
	defaultExpandedFirst = false,
	...rest
}: Props) => {
	const options = {
		sort,
		skip: (page - 1) * perpage,
		limit: perpage,
	};

	const deps = [JSON.stringify(query), JSON.stringify(sort), page, perpage];

	const {loading, results: items} = useConsultationsAndAppointments(
		query,
		options,
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