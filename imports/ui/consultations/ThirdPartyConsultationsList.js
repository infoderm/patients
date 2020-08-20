import React from 'react';
import PropTypes from 'prop-types';

import dateFormat from 'date-fns/format';

import ConsultationsPager from './ConsultationsPager.js';

import YearJumper from '../navigation/YearJumper.js';

export default function ThirdPartyConsultationsList({
	match,
	year,
	page,
	perpage
}) {
	const now = new Date();
	page =
		(match && match.params.page && Number.parseInt(match.params.page, 10)) ||
		page;
	year = (match && match.params.year) || year || dateFormat(now, 'yyyy');

	const current = Number.parseInt(year, 10);

	const begin = new Date(`${current}-01-01`);
	const end = new Date(`${current + 1}-01-01`);

	const query = {
		isDone: true,
		payment_method: 'third-party',
		datetime: {
			$gte: begin,
			$lt: end
		}
	};

	const sort = {datetime: -1};

	return (
		<div>
			<YearJumper current={current} toURL={(x) => `/third-party/${x}`} />
			<ConsultationsPager
				root={`/third-party/${year}`}
				url={match.url}
				page={page}
				perpage={perpage}
				query={query}
				sort={sort}
				itemProps={{showPrice: true}}
			/>
		</div>
	);
}

ThirdPartyConsultationsList.defaultProps = {
	page: 1,
	perpage: 10
};

ThirdPartyConsultationsList.propTypes = {
	page: PropTypes.number,
	perpage: PropTypes.number
};
