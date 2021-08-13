import React from 'react';
import PropsOf from '../../util/PropsOf';

import PagedConsultationsList from './PagedConsultationsList';
import useConsultationsAndAppointments from './useConsultationsAndAppointments';

interface ConsultationsPagerProps
	extends Omit<
		PropsOf<typeof PagedConsultationsList>,
		'root' | 'page' | 'perpage' | 'items'
	> {
	root?: string;
	url?: string;
	page?: number;
	perpage?: number;

	query?: object;
	sort: object;
}

const ConsultationsPager = ({
	query = {},
	sort,
	page = 1,
	perpage = 10,
	root,
	url,
	...rest
}: ConsultationsPagerProps) => {
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

	const _root = root || url.split('/page/')[0];

	return (
		<PagedConsultationsList
			loading={loading}
			root={_root}
			page={page}
			perpage={perpage}
			items={items}
			{...rest}
		/>
	);
};

export default ConsultationsPager;
